import request from 'axios';
import AbstractPlatform from '../platform/AbstractPlatform';
import DeviceModel from '../platform/models/DeviceModel';

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
	}

	getDevices() {
		const url = this._buildUrl('/inventory/managedObjects?fragmentType=c8y_IsDevice');

		return this._get(url)
			.then((response) => {
				console.log('response', response);

				return response.data.managedObjects.map(this._mapManagedObjectToDevice);
			})
			.catch((error) => {
				console.error('error', error);
			});
	}

	_mapManagedObjectToDevice(managedObject) {
		return new DeviceModel({
			name: managedObject.name,
		});
	}

	_buildUrl(query) {
		return `${this.config.protocol}://${this.config.tenant}.${this.config.host}/${query}`;
	}

	_get(url) {
		return request({
			url,
			method: 'get',
			...this._getStandardRequestParameters(),
		});
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
