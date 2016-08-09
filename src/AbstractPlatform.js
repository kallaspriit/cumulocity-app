import request from 'axios';
import keyMirror from 'keymirror';

export default class AbstractPlatform {

	static Measurement = keyMirror({
		LIGHT: null,
	});

	getDevices() {}
	getDevice(id) {}
	getRealtimeUpdates(channel, callback) {}

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
		const startTime = Date.now();

		return request({
			...this._getStandardRequestParameters(),
			url,
			method,
			...rest,
		}).then((response) => {
			const timeTaken = Date.now() - startTime;

			console.log(`got response for ${url} in ${timeTaken}ms`, response.data);

			return response;
		});
	}

	_getStandardRequestParameters() {
		return {};
	}
}
