import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import css from '../gfx/css/main.scss'; // eslint-disable-line no-unused-vars

injectTapEventPlugin();

function RootView({ children }) {
	return (
		<MuiThemeProvider>
			{children}
		</MuiThemeProvider>
	);
}

RootView.propTypes = {
	children: PropTypes.object,
};

export default RootView;
