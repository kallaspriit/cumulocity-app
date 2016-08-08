import AbstractPlatform from './AbstractPlatform';
import DeviceModel from '../models/DeviceModel';
import CapabilityModel from '../models/CapabilityModel';

export default class CumulocityPlatform extends AbstractPlatform {

	static urls = {
		getDevices: () => '/inventory/managedObjects?fragmentType=c8y_IsDevice',
		getDevice: (id) => `/inventory/managedObjects/${id}`,
		getRealtime: () => 'cep/realtime',
	};

	_realtimeId = 1;

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
	}

	getDevices() {
		const url = this._buildUrl(CumulocityPlatform.urls.getDevices());

		return this._get(url).then(this._extractDevices.bind(this));
	}

	getDevice(id) {
		const url = this._buildUrl(CumulocityPlatform.urls.getDevice(id));

		return this._get(url).then(this._extractDevice.bind(this));
	}

	_testRealtime() {
		const channel = '/measurements/410706';

		this._performRealtimeSubscription('/measurements/410706').then((clientId) => {
			const connect = () => {
				this._performRealtimeConnect(clientId).then((measurements) => {
					measurements
						.filter((measurement) => measurement.channel === channel)
						.forEach((measurement) => {
							const info = measurement.data.data.c8y_LightMeasurement.e;

							console.log(`light level: ${info.value} ${info.unit}`);
						});

					connect();
				});
			};

			connect();
		});
	}

	_performRealtimeSubscription(subscription) {
		return this._performRealtimeHandshake().then((clientId) => {
			console.log('performed handshake', clientId);

			const url = this._buildUrl(CumulocityPlatform.urls.getRealtime());
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

				console.log('subscribed', clientId, info);

				return clientId;
			});
		});
	}

	_performRealtimeConnect(clientId) {
		const url = this._buildUrl(CumulocityPlatform.urls.getRealtime());
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

			console.log('connect', response.data);

			return response.data;
		});
	}

	_performRealtimeHandshake() {
		const url = this._buildUrl(CumulocityPlatform.urls.getRealtime());
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
		return response.data.managedObjects.map(this._mapManagedObjectToDevice.bind(this));
	}

	_extractDevice(response) {
		return this._mapManagedObjectToDevice(response.data);
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

		// console.log('mapped', info, mappedDevice);

		return mappedDevice;
	}

	_extractCapabilities(info) {
		return Object.keys(info).reduce((capabilities, key) => {
			switch (key) {
				case 'c8y_Relay':
					capabilities.push(new CapabilityModel({
						type: CapabilityModel.Type.RELAY,
					}));
					break;

				case 'c8y_LightSensor':
					capabilities.push(new CapabilityModel({
						type: CapabilityModel.Type.LIGHT_SENSOR,
					}));
					break;

				default:
					// ignore
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

}
