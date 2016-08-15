import request from 'axios';
import keyMirror from 'keymirror';

export default class AbstractPlatform {

	static AggregationType = keyMirror({
		DAILY: null,
		HOURLY: null,
		MINUTELY: null,
		NONE: null,
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
	getDeviceLatestMeasurements(deviceId) {}
	getMeasurementSeries(
		deviceId,
		dateFrom = new Date(Date.now() - (24 * 60 * 60 * 1000)),
		dateTo = new Date(),
		aggregationType = AbstractPlatform.AggregationType.MINUTELY,
		pageSize = 1440,
		isRevertedOrder = true
	) {}
	sendDeviceOperation(deviceId, description, payload) {}
	getRealtimeUpdates(channel, callback) {}

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
