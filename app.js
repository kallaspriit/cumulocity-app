import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from './lib/redux-promise-loading-middleware';

import routes from './routes';
import * as reducers from './reducers';

const reducer = combineReducers({
	...reducers,
	routing: routerReducer,
});

const DevTools = createDevTools(
	<DockMonitor toggleVisibilityKey="ctrl-h" defaultIsVisible={false}>
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
