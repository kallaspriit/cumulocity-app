import { handleActions } from 'redux-actions';
import { FETCH_USER } from '../constants';

const defaultState = {
	isLoading: false,
	error: null,
	info: null,
	args: [],
};

export default handleActions({
	[FETCH_USER]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
