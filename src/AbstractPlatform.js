import request from 'axios';
import keyMirror from 'keymirror';

export default class AbstractPlatform {

	static Measurement = keyMirror({
		LIGHT: null,
	});

	getDevices() {}
	getDevice(id) {}
	getRealtimeUpdates(channel, callback) {}
	getCurrentMeasurement(deviceId, capabilityType) {}

	_get(url) {
		return this._request({
			url,
			method: 'get',
		});
	}

	_post(url, data) {
		return this._request({
			url,
			data,
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
