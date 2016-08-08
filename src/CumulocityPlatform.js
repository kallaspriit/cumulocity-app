
import AbstractPlatform from './AbstractPlatform';
import DeviceModel from '../models/DeviceModel';
import CapabilityModel from '../models/CapabilityModel';

export default class CumulocityPlatform extends AbstractPlatform {

	static urls = {
		getDevices: () => '/inventory/managedObjects?fragmentType=c8y_IsDevice',
		getDevice: (id) => `/inventory/managedObjects/${id}`,
	};

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
