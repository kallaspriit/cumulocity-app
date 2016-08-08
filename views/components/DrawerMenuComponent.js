import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import * as menuActions from '../../actions/menu-actions';

class DrawerMenuComponent extends Component {

	static propTypes = {
		menu: PropTypes.object.isRequired,

		openMainMenu: PropTypes.func.isRequired,
		closeMainMenu: PropTypes.func.isRequired,
	}

	render() {
		return (
			<Drawer
				onRequestChange={this.handleDrawerChange.bind(this)}
				open={this.props.menu.isOpen}
				docked={false}
				disableSwipeToOpen={false}
			>
				<MenuItem onTouchTap={this.handleOpen('devices')}>Devices</MenuItem>
				<MenuItem onTouchTap={this.handleOpen('device')}>Device</MenuItem>
			</Drawer>
		);
	}

	handleDrawerChange(isOpen, reason) {
		console.log('handleDrawerChange', isOpen, reason);

		if (isOpen) {
			this.props.openMainMenu();
		} else {
			this.props.closeMainMenu();
		}
	}

	handleOpen(view) {
		return () => {
			this.props.closeMainMenu();

			browserHistory.push(`/${view}`);
		};
	}
}

export default connect(
	state => ({
		menu: state.menu,
	}), {
		...menuActions,
	}
)(DrawerMenuComponent);
