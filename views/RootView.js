import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import css from '../gfx/css/main.scss'; // eslint-disable-line no-unused-vars

import DrawerMenuComponent from './components/DrawerMenuComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


injectTapEventPlugin();

function RootView({ children }) {
	return (
		<MuiThemeProvider>
			<div>
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
