import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import css from '../gfx/css/main.scss'; // eslint-disable-line no-unused-vars
import DrawerMenuComponent from './components/DrawerMenuComponent';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
	// override theme styles
});

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
