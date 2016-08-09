import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from '../libs/redux-promise-loading-middleware';
import { GET_DEVICE } from '../config/constants';

const defaultState = getDefaultAsyncState();

export default handleActions({
	[GET_DEVICE]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
