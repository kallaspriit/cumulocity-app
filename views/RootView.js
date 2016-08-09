import React, { Component, PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import css from '../gfx/css/main.scss'; // eslint-disable-line no-unused-vars
import DrawerMenuComponent from './components/DrawerMenuComponent';
import CumulocityPlatform from '../src/CumulocityPlatform';
import themeConfig from '../config/theme-config';
import cumulocityConfig from '../config/cumulocity-config';
import platformApi from '../apis/platform-api';

// use tap events
injectTapEventPlugin({
	shouldRejectClick: (lastTouchEventTimestamp, clickEventTimestamp) => {
		const diff = clickEventTimestamp - lastTouchEventTimestamp;

		return diff < 2000;
	},
});

// setup theme
const muiTheme = getMuiTheme(themeConfig);

// setup platform
const cumulocityPlatform = new CumulocityPlatform(cumulocityConfig);

platformApi.setProvider(cumulocityPlatform);

// root view
export default class RootView extends Component {

	static propTypes = {
		children: PropTypes.object,
		location: PropTypes.object.isRequired,
	};

	static childContextTypes = {
		canGoBack: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			canGoBack: false,
			history: [],
		};
	}

	getChildContext() {
		return {
			canGoBack: () => this.state.canGoBack,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.handleHistoryChange(nextProps);
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div className="top-wrap">
					{this.props.children}
					<DrawerMenuComponent />
				</div>
			</MuiThemeProvider>
		);
	}

	handleHistoryChange(nextProps) {
		if (nextProps.location !== this.props.location) {
			const newHistory = [
				...this.state.history,
			];

			switch (nextProps.location.action) {
				case 'PUSH':
					newHistory.push(nextProps.location.pathname);
					break;

				case 'POP':
					newHistory.pop();
					break;

				default:
					throw new Error(`Unexpected location action ${nextProps.location.action}`);
			}

			this.setState({
				canGoBack: newHistory.length > 0,
				history: newHistory,
			});
		}
	}
}

// for debugging only
window.app = {
	...window.app || {},
	cumulocity: cumulocityPlatform,
};
