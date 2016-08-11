import AbstractPlatform from './AbstractPlatform';
import DeviceModel from '../models/DeviceModel';
import CapabilityModel from '../models/CapabilityModel';
import MeasurementModel from '../models/MeasurementModel';

export default class CumulocityPlatform extends AbstractPlatform {

	constructor({
		host,
		protocol,
		tenant,
		username,
		password,
	}) {
		super();

		this.config = {
			host,
			protocol,
			tenant,
			username,
			password,
		};

		this.urls = {
			getDevices: () => 'inventory/managedObjects?fragmentType=c8y_IsDevice',
			getDevice: (id) => `inventory/managedObjects/${id}`,
			getRealtime: () => 'cep/realtime',
			getDeviceLatestMeasurements: (deviceId) => {
				const dateTo = this._formatDate(
					this._getTomorrowsDate()
				);

				return `measurement/measurements
					?dateFrom=1970-01-01
					&dateTo=${dateTo}
					&pageSize=1
					&revert=true
					&source=${deviceId}`;
			},
			sendDeviceOperation: () => 'devicecontrol/operations',
		};

		this._capabilityTypeMapping = {
			c8y_Relay: CapabilityModel.Type.RELAY,
			c8y_LightSensor: CapabilityModel.Type.LIGHT,
			c8y_MotionSensor: CapabilityModel.Type.MOTION,
			c8y_Hardware: CapabilityModel.Type.HARDWARE,
		};

		this._measurementTypeMapping = {
			c8y_LightMeasurement: MeasurementModel.Type.LIGHT,
			com_stagnationlab_c8y_driver_measurements_MotionStateMeasurement: MeasurementModel.Type.MOTION,
			com_stagnationlab_c8y_driver_measurements_RelayStateMeasurement: MeasurementModel.Type.RELAY,
		};

		this._realtimeId = 1;
	}

	authenticate(tenant, username, password) {
		console.log('authenticate', tenant, username, password);
	}

	getDevices() {
		const url = this._buildUrl(
			this.urls.getDevices()
		);

		return this._get(url).then(this._extractDevices.bind(this));
	}

	getDevice(id) {
		const url = this._buildUrl(
			this.urls.getDevice(id)
		);

		return this._get(url).then(this._extractDevice.bind(this));
	}

	getRealtimeUpdates(channel, callback) {
		let isActive = true;

		this._performRealtimeSubscription(channel).then((clientId) => {
			const connect = () => {
				this._performRealtimeConnect(clientId).then((updates) => {
					callback(
						this._generifyRealtimeUpdates(updates)
					);

					if (isActive) {
						connect();
					}
				});
			};

			connect();
		});

		return () => {
			isActive = false;
		};
	}

	getDeviceLatestMeasurements(deviceId) {
		const url = this._buildUrl(
			this.urls.getDeviceLatestMeasurements(deviceId)
		);

		return this._get(url).then((response) => {
			const measurements = response.data.measurements.reduce((result, item) => [
				...result,
				...this._extractMeasurements(item),
			], []);

			return {
				[deviceId]: measurements,
			};
		});
	}

	sendDeviceOperation(deviceId, description, payload) {
		const url = this._buildUrl(
			this.urls.sendDeviceOperation()
		);
		const data = {
			deviceId,
			description,
			...payload,
		};

		const headers = {
			'Content-Type': 'application/vnd.com.nsn.cumulocity.operation+json',
		};

		return this._post(url, data, headers).then((response) => response.data.c8y_Relay);
	}

	// rest is private
	_generifyRealtimeUpdates(_updates) {
		return _updates
			.filter((update) => update.data && update.data.data)
			.map((update) => this._extractMeasurements(update.data.data))
			.filter((update) => update !== null);
	}

	_performRealtimeSubscription(subscription) {
		return this._performRealtimeHandshake().then((clientId) => {
			const url = this._buildUrl(this.urls.getRealtime());
			const payload = [{
				channel: '/meta/subscribe',
				id: this._getNextRealtimeId(),
				subscription,
				clientId,
			}];

			return this._post(url, payload).then((response) => {
				if (!Array.isArray(response.data) || response.data.length !== 1) {
					console.error('got invalid handshake response', payload, response.data);

					throw new Error('Got invalid handshake response');
				}

				const info = response.data[0];

				if (!info.successful) {
					throw new Error(`Subscription failed (${info.error})`);
				}

				return clientId;
			});
		});
	}

	_performRealtimeConnect(clientId) {
		const url = this._buildUrl(
			this.urls.getRealtime()
		);
		const payload = [{
			clientId,
			id: this._getNextRealtimeId(),
			channel: '/meta/connect',
			connectionType: 'long-polling',
		}];

		return this._post(url, payload).then((response) => {
			if (!Array.isArray(response.data)) {
				console.error('got invalid handshake response', payload, response.data);

				throw new Error('Got invalid handshake response');
			}

			return response.data;
		});
	}

	_performRealtimeHandshake() {
		const url = this._buildUrl(
			this.urls.getRealtime()
		);
		const payload = [{
			channel: '/meta/handshake',
			id: this._getNextRealtimeId(),
			version: '1.0',
			minimumVersion: '0.9',
			supportedConnectionTypes: [
				'long-polling',
				'callback-polling',
			],
			advice: {
				timeout: 60000,
				interval: 0,
			},
		}];

		return this._post(url, payload).then((response) => {
			if (!Array.isArray(response.data) || response.data.length !== 1) {
				console.error('got invalid handshake response', payload, response.data);

				throw new Error('Got invalid handshake response');
			}

			const info = response.data[0];

			if (!info.successful) {
				throw new Error(`Handshake failed (${info.error})`);
			}

			const clientId = info.clientId;

			return clientId;
		});
	}

	_extractDevices(response) {
		return response.data.managedObjects.map(
			this._mapManagedObjectToDevice.bind(this)
		);
	}

	_extractDevice(response) {
		return this._mapManagedObjectToDevice(response.data);
	}

	_extractMeasurements(info) {
		return Object.keys(info).reduce((measurements, key) => {
			const measurementType = this._mapMeasurementType(key);

			if (measurementType !== MeasurementModel.Type.UNSUPPORTED) {
				const measurementInfo = info[key];
				const measurement = new MeasurementModel({
					type: measurementType,
					info: measurementInfo,
				});

				measurements.push(measurement);
			}

			return measurements;
		}, []);
	}

	_extractCapabilities(info) {
		return Object.keys(info).reduce((capabilities, key) => {
			const capabilityType = this._mapCapabilityType(key);

			if (capabilityType !== CapabilityModel.Type.UNSUPPORTED) {
				const capabilityInfo = info[key];
				const capability = new CapabilityModel({
					type: capabilityType,
					info: capabilityInfo,
				});

				capabilities.push(capability);
			}

			return capabilities;
		}, []);
	}

	_mapManagedObjectToDevice(info) {
		const mappedDevice = new DeviceModel({
			id: info.id,
			name: info.name,
			type: info.type ? info.type : null,
			serial: info.c8y_Hardware && info.c8y_Hardware.serialNumber ? info.c8y_Hardware.serialNumber : null,
			model: info.c8y_Hardware
				? info.c8y_Hardware.model
				: null,
			isOnline: info.c8y_Connection && info.c8y_Connection.status
				? info.c8y_Connection.status === 'CONNECTED'
				: false,
			childDevices: info.childDevices ? info.childDevices.references.map(this._mapChildDevice.bind(this)) : [],
			supportedOperations: info.c8y_SupportedOperations ? info.c8y_SupportedOperations : [],
			capabilities: this._extractCapabilities(info),
		});

		return mappedDevice;
	}

	_mapCapabilityType(type) {
		if (typeof this._capabilityTypeMapping[type] === 'undefined') {
			return CapabilityModel.Type.UNSUPPORTED;
		}

		return this._capabilityTypeMapping[type];
	}

	_mapMeasurementType(type) {
		if (typeof this._measurementTypeMapping[type] === 'undefined') {
			return MeasurementModel.Type.UNSUPPORTED;
		}

		return this._measurementTypeMapping[type];
	}

	_mapChildDevice(info) {
		return this._mapManagedObjectToDevice(info.managedObject);
	}

	_getNextRealtimeId() {
		return this._realtimeId++;
	}

	_buildUrl(query) {
		return `${this.config.protocol}://${this.config.tenant}.${this.config.host}/${query}`;
	}

	_getStandardRequestParameters() {
		return {
			auth: {
				username: this.config.username,
				password: this.config.password,
			},
		};
	}

	_formatDate(date = new Date()) {
		return date.toISOString().substr(0, 10);
	}

	_getTomorrowsDate() {
		return new Date(Date.now() + (24 * 60 * 60 * 1000));
	}

}
