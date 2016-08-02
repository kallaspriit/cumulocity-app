import { handleActions } from 'redux-actions';
import { FETCH_USER } from '../constants';

const defaultState = {
	info: null,
};

export default handleActions({
	[FETCH_USER]: (state, action) => ({
		...state,
		info: {
			id: 1,
			name: `Jack Daniels #${action.payload}`,
		},
	}),
}, defaultState);
