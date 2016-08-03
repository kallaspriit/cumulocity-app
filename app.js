import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createDevTools } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

function promiseMiddleware() {
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

import routes from './routes';
import * as reducers from './reducers';

const reducer = combineReducers({
	...reducers,
	routing: routerReducer,
});

const DevTools = createDevTools(
	<DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
		<LogMonitor theme="tomorrow" preserveScrollTop={false} />
	</DockMonitor>
);

const store = createStore(
	reducer,
	compose(
		applyMiddleware(thunkMiddleware),
		applyMiddleware(promiseMiddleware),
		DevTools.instrument()
	)
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Provider store={store}>
		<div>
			<Router history={history} routes={routes} />
			<DevTools />
		</div>
	</Provider>,
	document.getElementById('root')
);
