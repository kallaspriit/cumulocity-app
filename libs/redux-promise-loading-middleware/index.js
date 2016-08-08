import React from 'react';

export default function promiseMiddleware() {
	return (next) => (action) => {
		const {
			payload,
			...rest,
		} = action;

		// check whether the payload looks like a promise
		if (payload && typeof payload.then === 'function') {
			next({
				...rest,
				payload: {
					isLoading: true,
					error: null,
				},
			});

			payload.then(
				(info) => {
					next({
						...rest,
						payload: {
							isLoading: false,
							error: null,
							info,
						},
					});
				},
				(error) => {
					next({
						...rest,
						payload: {
							isLoading: false,
							error,
							info: null,
						},
					});
				}
			);
		} else {
			// not a promise, just pass-through
			next(action);
		}
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

export function renderAsync(
	info,
	renderInfo,
	renderLoading = null,
	renderError = null
) {
	if (device.error) {
		return <ErrorComponent error={device.error} />;
	} else if (device.isLoading || !device.info) {
		return <LoaderComponent />;
	}
}
