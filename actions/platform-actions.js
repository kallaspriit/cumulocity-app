import { createAction } from 'redux-actions';
import platformApi from '../apis/platform-api';
import {
	GET_DEVICES,
	GET_DEVICE,
	GET_REALTIME_UPDATES,
	STOP_REALTIME_UPDATES,
} from '../constants';

const realtimeChannelToCancelMap = {};

export const getDevices = createAction(GET_DEVICES, platformApi.getDevices);
export const getDevice = createAction(GET_DEVICE, platformApi.getDevice);
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

	console.log('stopRealtimeUpdates', channel);

	cancel();

	delete realtimeChannelToCancelMap[channel];

	dispatch(
		createAction(STOP_REALTIME_UPDATES)(channel)
	);
};
