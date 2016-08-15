import AbstractPlatform from './AbstractPlatform';
import DeviceModel from '../models/DeviceModel';
import CapabilityModel from '../models/CapabilityModel';
import MeasurementModel from '../models/MeasurementModel';

export default class CumulocityPlatform extends AbstractPlatform {

	constructor({
		protocol = 'https',
		host = 'cumulocity.com',
	} = {}) {
		super();

		this.network = {
			protocol,
			host,
		};

		this.urls = {
			authenticate: () => 'user/currentUser',
			getDevices: () => 'inventory/managedObjects?fragmentType=c8y_IsDevice',
			getDevice: (id) => `inventory/managedObjects/${id}`,
			getRealtime: () => 'cep/realtime',
			getDeviceLatestMeasurements: (deviceId) => {
				const dateTo = this._formatDate(
					this._getTomorrowsDate()
				);

				return 'measurement/measurements' +
					'?dateFrom=1970-01-01' +
					`&dateTo=${dateTo}` +
					'&pageSize=1' +
					'&revert=true' +
					`&source=${deviceId}`;
			},
			getMeasurementSeries: (
				deviceId,
				dateFrom,
				dateTo,
				aggregationType,
				pageSize,
				isRevertedOrder
			) => 'measurement/measurements/series' + // eslint-disable-line prefer-template
				`?dateFrom=${dateFrom.toISOString()}` +
				`&dateTo=${dateTo.toISOString()}` +
					(aggregationType !== AbstractPlatform.AggregationType.NONE
						? `&aggregationType=${aggregationType}`
						: ''
					) +
					`&pageSize=${pageSize}` +
					`&revert=${isRevertedOrder ? 'true' : 'false'}` +
					`&source=${deviceId}`,
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
		const url = this._buildUrl(
			this.urls.authenticate()
		);

		return this._get(url).then((response) => response.data);
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

	getMeasurementSeries(
		deviceId,
		dateFrom = new Date(Date.now() - (24 * 60 * 60 * 1000)),
		dateTo = new Date(),
		aggregationType = CumulocityPlatform.AggregationType.NONE,
		pageSize = 24 * 60,
		isRevertedOrder = true
	) {
		const url = this._buildUrl(
			this.urls.getMeasurementSeries(
				deviceId,
				dateFrom,
				dateTo,
				aggregationType,
				pageSize,
				isRevertedOrder
			)
		);

		return this._get(url).then((response) => {
			const values = response.data.values;
			const indexToTypeMap = {};

			const measurements = response.data.series.reduce((result, item, index) => {
				const type = this._mapMeasurementType(item.type);

				if (type === MeasurementModel.Type.UNSUPPORTED) {
					return result;
				}

				indexToTypeMap[index] = type;

				return {
					...result,
					[this._mapMeasurementType(item.type)]: [],
				};
			}, {});

			Object.keys(values).forEach((timestamp) => {
				const value = values[timestamp];

				for (let i = 0; i < value.length; i++) {
					const type = indexToTypeMap[i];

					if (typeof type === 'undefined' || value[i] === null) {
						continue;
					}

					measurements[type].push([new Date(timestamp), value[i].min, value[i].max]);
				}
			});

			return {
				[deviceId]: measurements,
			};
		});
	}

	/*
	_test() {
		return this.getMeasurementSeries(
			'2664191',
			new Date(Date.now() - (24 * 60 * 60 * 1000)),
			new Date(),
			AbstractPlatform.AggregationType.NONE,
			24 * 60,
			true
		).then((response) => {
			console.log('test', response);
		});
	}
	*/

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
			isOnline: info.c8y_Availability && info.c8y_Availability.status
				? info.c8y_Availability.status === 'AVAILABLE'
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
		const authenticationInfo = this.store.getState().authentication.info;

		return `${this.network.protocol}://${authenticationInfo.tenant}.${this.network.host}/${query}`;
	}

	_getStandardRequestParameters() {
		const authenticationInfo = this.store.getState().authentication.info;

		return {
			auth: {
				username: authenticationInfo.username,
				password: authenticationInfo.password,
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
