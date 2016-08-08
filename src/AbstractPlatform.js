import request from 'axios';

export default class AbstractPlatform {

	getDevices() {}
	getDevice(id) {}

	_get(url) {
		return this._request({
			url,
			method: 'get',
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
