import AbstractPlatform from './AbstractPlatform';
import DeviceModel from '../models/DeviceModel';
import CapabilityModel from '../models/CapabilityModel';

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
			getDevices: () => '/inventory/managedObjects?fragmentType=c8y_IsDevice',
			getDevice: (id) => `/inventory/managedObjects/${id}`,
			getRealtime: () => 'cep/realtime',
			getCurrentMeasurement: (deviceId, capabilityType) => {
				const dateTo = this._formatDate(
					this._getTomorrowsDate()
				);

				return `/measurement/measurements
					?dateFrom=1970-01-01
					&dateTo=${dateTo}
					&fragmentType=${capabilityType}
					&pageSize=1
					&revert=true
					&source=${deviceId}`;
			},
		};

		this._capabilityTypeMapping = {
			c8y_Relay: CapabilityModel.Type.RELAY,
			c8y_LightSensor: CapabilityModel.Type.LIGHT_SENSOR,
			c8y_Hardware: CapabilityModel.Type.HARDWARE,
		};

		this._realtimeId = 1;
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

	getCurrentMeasurement(deviceId, capabilityType) {
		const url = this._buildUrl(
			this.urls.getCurrentMeasurement(deviceId, capabilityType)
		);

		return this._get(url).then(this._extractCurrentMeasurement.bind(this));
	}

	_generifyRealtimeUpdates(_updates) {
		return _updates
			.filter((update) => update.data && update.data.data)
			.map((update) => {
				const {
					id,
					time,
				} = update.data.data;

				const measurement = this._getMeasurement(update);

				if (measurement === null) {
					return null;
				}

				return {
					id,
					time,
					...measurement,
				};
			})
			.filter((update) => update !== null);
	}

	_getMeasurement(update) {
		const parsers = {
			c8y_LightMeasurement: this._getLightMeasurement.bind(this),
		};

		return Object.keys(parsers).reduce((measurement, name) => {
			if (typeof update.data.data[name] !== 'undefined') {
				measurement = parsers[name](update); // eslint-disable-line
			}

			return measurement;
		}, null);
	}

	_getLightMeasurement(update) {
		const info = update.data.data.c8y_LightMeasurement.e;

		return {
			type: AbstractPlatform.Measurement.LIGHT,
			info: {
				value: info.value,
				unit: info.unit,
			},
		};
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

	_getNextRealtimeId() {
		return this._realtimeId++;
	}

	_extractDevices(response) {
		return response.data.managedObjects.map(
			this._mapManagedObjectToDevice.bind(this)
		);
	}

	_extractDevice(response) {
		return this._mapManagedObjectToDevice(response.data);
	}


	_extractCurrentMeasurement(response) {
		console.log('_extractCurrentMeasurement', response);

		return null;
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

		// console.log('mapped', mappedDevice.name, info, mappedDevice);

		return mappedDevice;
	}

	_mapCapabilityType(type) {
		if (typeof this._capabilityTypeMapping[type] === 'undefined') {
			return CapabilityModel.Type.UNSUPPORTED;
		}

		return this._capabilityTypeMapping[type];
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

				console.log('found capability', capability, capabilityInfo);
			}

			return capabilities;
		}, []);
	}

	_mapChildDevice(info) {
		return this._mapManagedObjectToDevice(info.managedObject);
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
