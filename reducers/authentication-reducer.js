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
		const isSuccessful = action.payload.error === null;

		console.log('AUTHENTICATE', isSuccessful, state, action);

		return {
			...state,
			isLoading: action.payload.isLoading,
			info: {
				...state.info,
				isLoggedIn: isSuccessful,
				isInvalidCredentials: !isSuccessful,
			},
		};
	},
}, defaultState);
