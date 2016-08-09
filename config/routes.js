import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import RootView from '../views/RootView';
import DevicesView from '../views/DevicesView';
import DeviceView from '../views/DeviceView';

export default [
	<Route path="/" component={RootView}>
		<Route path="devices" component={DevicesView} />
		<Route path="device/:deviceId" component={DeviceView} />
		<IndexRedirect to="devices" />
	</Route>,
];
