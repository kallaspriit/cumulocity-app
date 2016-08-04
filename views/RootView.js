import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import css from '../gfx/css/main.scss'; // eslint-disable-line no-unused-vars
import DrawerMenuComponent from './components/DrawerMenuComponent';
import CumulocityPlatform from '../libs/cumulocity/CumulocityPlatform';
import cumulocityConfig from '../config/cumulocity';
import platformApi from '../apis/platform-api';

injectTapEventPlugin();

// setup theme
const muiTheme = getMuiTheme({
	// override theme styles
});

// setup platform
const cumulocityPlatform = new CumulocityPlatform(cumulocityConfig);

platformApi.setProvider(cumulocityPlatform);

platformApi.getDevices().then((devices) => {
	console.log('devices', devices);
});

// root view
function RootView({ children }) {
	return (
		<MuiThemeProvider muiTheme={muiTheme}>
			<div className="top-wrap">
				{children}
				<DrawerMenuComponent />
			</div>
		</MuiThemeProvider>
	);
}

RootView.propTypes = {
	children: PropTypes.object,
};

export default RootView;
