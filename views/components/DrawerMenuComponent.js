import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class DrawerMenuComponent extends Component {

	state = {
		isOpen: false,
	};

	render() {
		return (
			<Drawer
				onRequestChange={this.handleDrawerChange.bind(this)}
				open={this.state.isOpen}
				docked={false}
				disableSwipeToOpen={false}
			>
				<MenuItem onTouchTap={this.handleOpen('device')}>Device</MenuItem>
				<MenuItem onTouchTap={this.handleOpen('user')}>User</MenuItem>
			</Drawer>
		);
	}

	handleDrawerChange(isOpen, reason) {
		console.log('handleDrawerChange', isOpen, reason);

		this.setState({
			isOpen,
		});
	}

	handleOpen(view) {
		return () => {
			this.setState({
				isOpen: false,
			});

			browserHistory.push(`/${view}`);
		};
	}

}
