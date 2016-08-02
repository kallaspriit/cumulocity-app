import React from 'react';
import { Route } from 'react-router';

import RootView from './views/RootView';
import CounterView from './views/CounterView';

export default [
	<Route path="/" component={RootView}>
		<Route path="counter" component={CounterView} />
	</Route>,
];
