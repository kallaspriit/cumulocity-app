import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from '../libs/redux-promise-loading-middleware';
import { FETCH_USER } from '../constants';

const defaultState = getDefaultAsyncState();

export default handleActions({
	[FETCH_USER]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
