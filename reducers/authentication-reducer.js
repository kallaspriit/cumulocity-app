import { handleActions } from 'redux-actions';
import store from 'store';
import keyMirror from 'keymirror';
import { getDefaultAsyncState } from '../libs/redux-promise-loading-middleware';
import { SET_CREDENTIALS, AUTHENTICATE } from '../config/constants';

const StoreKey = keyMirror({
	AUTHENTICATION_TENANT: null,
	AUTHENTICATION_USERNAME: null,
	AUTHENTICATION_PASSWORD: null,
});

const defaultState = {
	...getDefaultAsyncState(),
	info: {
		tenant: store.get(StoreKey.AUTHENTICATION_TENANT, ''),
		username: store.get(StoreKey.AUTHENTICATION_USERNAME, ''),
		password: store.get(StoreKey.AUTHENTICATION_PASSWORD, ''),
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

		if (isLoggedIn) {
			store.set(StoreKey.AUTHENTICATION_TENANT, state.info.tenant);
			store.set(StoreKey.AUTHENTICATION_USERNAME, state.info.username);
			store.set(StoreKey.AUTHENTICATION_PASSWORD, state.info.password);
		}

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
