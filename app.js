import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from './libs/redux-promise-loading-middleware';
import routes from './config/routes';
import * as reducers from './reducers';

// configure combined reduxer which includes the router
const reducer = combineReducers({
	...reducers,
	routing: routerReducer,
});

// configure dev-tools
const DevTools = createDevTools(
	<DockMonitor
		toggleVisibilityKey="ctrl-h"
		changePositionKey="ctrl-j"
		changeMonitorKey="ctrl-m"
		defaultIsVisible={false}
	>
		<LogMonitor theme="tomorrow" preserveScrollTop={false} />
		<SliderMonitor />
	</DockMonitor>
);

// configure the store with appopriate middlewares
const store = createStore(
	reducer,
	compose(
		applyMiddleware(thunkMiddleware),
		applyMiddleware(promiseMiddleware),
		DevTools.instrument()
	)
);

// configure router history
const history = syncHistoryWithStore(browserHistory, store);

// render the application
ReactDOM.render(
	<Provider store={store}>
		<div>
			<Router history={history} routes={routes} />
			<DevTools />
		</div>
	</Provider>,
	document.getElementById('root')
);

// for debugging only
window.app = {
	...window.app || {},
	store,
	reducer,
	history,
};
