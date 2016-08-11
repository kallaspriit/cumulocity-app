import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from '../libs/redux-promise-loading-middleware';
import { SET_CREDENTIALS, AUTHENTICATE } from '../config/constants';

const defaultState = {
	...getDefaultAsyncState(),
	info: {
		tenant: '',
		username: '',
		password: '',
		isLoggedIn: false,
		isInvalidCredentials: false,
	},
};

export default handleActions({
	[SET_CREDENTIALS]: (state, action) => ({
		...state,
		...action.payload,
	}),
	[AUTHENTICATE]: (state, action) => {
		const isLoggedIn = !action.payload.isLoading && action.payload.error === null;
		const isInvalidCredentials = action.payload.error !== null;

		return {
			...state,
			isLoading: action.payload.isLoading,
			info: {
				...state.info,
				isLoggedIn,
				isInvalidCredentials,
			},
		};
	},
}, defaultState);
