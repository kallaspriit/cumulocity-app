import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from '../libs/redux-promise-loading-middleware';
import { GET_DEVICES } from '../config/constants';

const defaultState = getDefaultAsyncState();

export default handleActions({
	[GET_DEVICES]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
