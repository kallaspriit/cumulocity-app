import { createAction } from 'redux-actions';
import platformApi from '../apis/platform-api';
import {
	GET_DEVICES,
	GET_DEVICE,
} from '../constants';

export const getDevices = createAction(GET_DEVICES, platformApi.getDevices);
export const getDevice = createAction(GET_DEVICE, platformApi.getDevice);
