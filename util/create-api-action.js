import { createAction } from 'redux-actions';

export default function createApiAction(name, callback) {
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
				console.log('api request succeeded', info);

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
				console.warn('api request failed', error);

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
