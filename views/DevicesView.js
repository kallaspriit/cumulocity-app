import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import CompareArrows from 'material-ui/svg-icons/action/compare-arrows';

import HeaderComponent from './components/HeaderComponent';
import AsyncComponent from './components/AsyncComponent';

import * as platformActions from '../actions/platform-actions';

class DevicesView extends Component {

	static propTypes = {
		devices: PropTypes.object.isRequired,

		getDevices: PropTypes.func.isRequired,
	};

	componentDidMount() {
		this.props.getDevices();
	}

	render() {
		const {
			devices,
		} = this.props;

		return (
			<div className="devices-view">
				<HeaderComponent title="Devices" />
				<AsyncComponent info={devices} render={this.renderDevices.bind(this)} />
			</div>
		);
	}

	renderDevices(devices) {
		return (
			<List>
				{devices.map(this.renderDevice)}
			</List>
		);
	}

	renderDevice(device) {
		return (
			<ListItem
				key={device.id}
				primaryText={device.name}
				secondaryText={device.serial && device.model ? `${device.model} - ${device.serial}` : 'n/a'}
				leftIcon={<CompareArrows color={device.isOnline ? '#090' : '#900'} />}
				onTouchTap={() => browserHistory.push(`/device/${device.id}`)}
			/>
		);
	}
}

export default connect(
	state => ({
		devices: state.devices,
	}), {
		...platformActions,
	}
)(DevicesView);
