import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import RootView from './views/RootView';
import DeviceView from './views/DeviceView';
import UserView from './views/UserView';

export default [
	<Route path="/" component={RootView}>
		<Route path="device" component={DeviceView} />
		<Route path="user" component={UserView} />
		<IndexRedirect to="device" />
	</Route>,
];
