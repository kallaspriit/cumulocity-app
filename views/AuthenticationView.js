import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import CompareArrows from 'material-ui/svg-icons/action/compare-arrows';
import MenuItem from 'material-ui/MenuItem';

import HeaderComponent from './components/HeaderComponent';
import AsyncComponent from './components/AsyncComponent';

import * as platformActions from '../actions/platform-actions';

class AuthenticationView extends Component {

	static propTypes = {
		authentication: PropTypes.object.isRequired,

		authenticate: PropTypes.func.isRequired,
	};

	render() {
		const {
			authentication,
		} = this.props;

		return (
			<div className="authentication-view">
				<HeaderComponent title="Authentication" menus={this.renderHeaderMenus()} />
				<AsyncComponent info={authentication} render={this.renderContents.bind(this)} />
			</div>
		);
	}

	renderContents(authentication) {
		return (
			<div className="main-contents">
				{JSON.stringify(authentication)}
			</div>
		);
	}

	renderDevice(device) {
		return (
			<ListItem
				key={device.id}
				primaryText={device.name}
				secondaryText={device.serial && device.model ? `${device.model} - ${device.serial}` : 'n/a'}
				leftIcon={<CompareArrows color={device.isOnline ? '#090' : '#900'} />}
				onTouchTap={() => browserHistory.push(`/devices/${device.id}`)}
			/>
		);
	}

	renderHeaderMenus() {
		return [
			<MenuItem key={1} onTouchTap={() => this.handleLogout()}>Logout</MenuItem>,
		];
	}

	handleLogout() {
		console.log('logout');
	}
}

export default connect(
	state => ({
		authentication: state.authentication,
	}), {
		...platformActions,
	}
)(AuthenticationView);
