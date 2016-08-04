import { createAction } from 'redux-actions';
import platformApi from '../apis/platform-api';
import { GET_DEVICES } from '../constants';

export const getDevices = createAction(GET_DEVICES, platformApi.getDevices);
export const getDevices2 = createAction(GET_DEVICES, platformApi.getDevices);
