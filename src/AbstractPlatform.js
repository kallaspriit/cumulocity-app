import request from 'axios';
import keyMirror from 'keymirror';

export default class AbstractPlatform {

	static Measurement = keyMirror({
		LIGHT: null,
	});

	constructor() {
		this.store = null;
	}

	setStore(store) {
		this.store = store;
	}

	authenticate(tenant, username, password) {}
	getDevices() {}
	getDevice(id) {}
	getRealtimeUpdates(channel, callback) {}
	getDeviceLatestMeasurements(deviceId) {}
	sendDeviceOperation(deviceId, description, payload) {}

	_get(url) {
		return this._request({
			url,
			method: 'get',
		});
	}

	_post(url, data, headers = {}) {
		return this._request({
			url,
			data,
			headers,
			method: 'post',
		});
	}

	_request({
		url,
		method = 'get',
		...rest,
	}) {
		return request({
			...this._getStandardRequestParameters(),
			url,
			method,
			...rest,
		});
	}

	_getStandardRequestParameters() {
		return {};
	}
}
