import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from '../libs/redux-promise-loading-middleware';
import { AUTHENTICATE } from '../config/constants';

const defaultState = {
	...getDefaultAsyncState(),
	info: {
		tenant: 'null',
		username: null,
		password: null,
	},
};

export default handleActions({
	[AUTHENTICATE]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
