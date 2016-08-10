import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import RootView from '../views/RootView';
import DevicesView from '../views/DevicesView';
import DeviceView from '../views/DeviceView';
import PageNotFoundView from '../views/PageNotFoundView';

export default [
	<Route path="/" component={RootView}>
		<Route path="devices" component={DevicesView} />
		<Route path="devices/:deviceId" component={DeviceView} />
		<Route path="*" component={PageNotFoundView} />
		<IndexRedirect to="devices" />
	</Route>,
];
