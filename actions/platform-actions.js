import { createAction } from 'redux-actions';
import platformApi from '../apis/platform-api';
import {
	AUTHENTICATE,
	GET_DEVICES,
	GET_DEVICE,
	GET_REALTIME_UPDATES,
	STOP_REALTIME_UPDATES,
	GET_DEVICE_LATEST_MEASUREMENTS,
	SEND_DEVICE_OPERATION,
} from '../config/constants';

const realtimeChannelToCancelMap = {};

export const authenticate = createAction(
	AUTHENTICATE,
	platformApi.authenticate
);

export const getDevices = createAction(
	GET_DEVICES,
	platformApi.getDevices
);

export const getDevice = createAction(
	GET_DEVICE,
	platformApi.getDevice
);

export const getDeviceLatestMeasurements = createAction(
	GET_DEVICE_LATEST_MEASUREMENTS,
	platformApi.getDeviceLatestMeasurements
);

export const sendDeviceOperation = createAction(
	SEND_DEVICE_OPERATION,
	platformApi.sendDeviceOperation
);

export const getRealtimeUpdates = (channel) => (dispatch) => {
	dispatch(
		createAction(GET_REALTIME_UPDATES)({
			[channel]: null,
		})
	);

	realtimeChannelToCancelMap[channel] = platformApi.getRealtimeUpdates(channel, (info) => {
		dispatch(
			createAction(GET_REALTIME_UPDATES)({
				[channel]: info,
			})
		);
	});
};

export const stopRealtimeUpdates = (channel) => (dispatch) => {
	const cancel = realtimeChannelToCancelMap[channel];

	if (typeof cancel !== 'function') {
		return;
	}

	cancel();

	delete realtimeChannelToCancelMap[channel];

	dispatch(
		createAction(STOP_REALTIME_UPDATES)(channel)
	);
};
