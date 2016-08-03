import { createAction } from 'redux-actions';

export default function createAsyncAction(name, callback) {
	return (...args) => (dispatch) => {
		dispatch(
			createAction(name)({
				isLoading: true,
				error: null,
				args,
			})
		);

		Promise.resolve(callback(...args)).then(
			(info) => {
				dispatch(
					createAction(name)({
						isLoading: false,
						error: null,
						info,
						args,
					})
				);
			},
			(error) => {
				dispatch(
					createAction(name)({
						isLoading: false,
						error,
						info: null,
						args,
					})
				);
			}
		);
	};
}

export function getDefaultAsyncState(info = null) {
	return {
		isLoading: false,
		error: null,
		info,
		args: [],
	};
}
