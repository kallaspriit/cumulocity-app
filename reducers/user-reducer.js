import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from '../util/create-async-action';
import { FETCH_USER } from '../constants';

const defaultState = getDefaultAsyncState();

export default handleActions({
	[FETCH_USER]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
