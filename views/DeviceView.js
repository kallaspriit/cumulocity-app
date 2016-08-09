import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';

import HeaderComponent from './components/HeaderComponent';
import AsyncComponent from './components/AsyncComponent';
import LightSensorCapabilityComponent from './components/capabilities/LightSensorCapabilityComponent';

import * as platformActions from '../actions/platform-actions';
import CapabilityModel from '../models/CapabilityModel';

class DeviceView extends Component {

	static propTypes = {
		params: PropTypes.object.isRequired,
		device: PropTypes.object.isRequired,
		realtime: PropTypes.object.isRequired,

		getDevice: PropTypes.func.isRequired,
		getRealtimeUpdates: PropTypes.func.isRequired,
		stopRealtimeUpdates: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.isRealtimeUpdatesSetupComplete = false;
	}

	componentWillMount() {
		this.props.getDevice(this.props.params.deviceId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.deviceId !== this.props.params.deviceId) {
			this.stopRealtimeUpdates(this.props.params.deviceId);
			this.setupRealtimeUpdates(nextProps.params.deviceId);

			this.props.getDevice(nextProps.params.deviceId);
		}
	}

	componentDidUpdate() {
		if (this.props.device.info !== null && !this.isRealtimeUpdatesSetupComplete) {
			this.setupRealtimeUpdates(this.props.params.deviceId);

			this.isRealtimeUpdatesSetupComplete = true;
		}
	}

	componentWillUnmount() {
		this.stopRealtimeUpdates();
	}

	render() {
		const {
			device,
		} = this.props;

		const title = !device.info || device.isLoading
			? 'Devices » loading...'
			: `Devices » ${device.info.name}`;

		return (
			<div className="device-view">
				<HeaderComponent title={title} />
				<AsyncComponent info={device} render={this.renderDevice.bind(this)} />
			</div>
		);
	}

	renderDevice(info) {
		const backgroundImage = this.getBackgroundImage(info);

		return (
			<Card className="main-contents">
				<CardHeader
					title="Priit Kallas"
					subtitle="Lai 29 4th floor"
					avatar="/gfx/images/avatar.png"
				/>
				<CardMedia
					overlay={
						<CardTitle
							title={info.name}
							subtitle={`${info.model} - ${info.serial}`}
						/>
					}
				>
					<img
						src={backgroundImage}
						alt={info.type}
					/>
				</CardMedia>
				{this.renderDeviceCapabilityList(info)}
				{this.renderChildDeviceList(info.childDevices)}
			</Card>
		);
	}

	renderDeviceCapabilityList(info) {
		if (info.capabilities.length === 0) {
			return null;
		}

		return (
			<List>
				{info.capabilities.map((capability, index) => this.renderCapabilityListItem(info, capability, index))}
			</List>
		);
	}

	renderCapabilityListItem(info, capability, index) {
		return (
			<ListItem
				key={index}
			>
				{this.renderCapabilityWidget(info, capability)}
			</ListItem>
		);
	}

	renderCapabilityWidget(info, capability) {
		const channel = this.getDeviceMeasurementsChannelName(this.props.params.deviceId);
		const realtimeUpdates = this.props.realtime[channel] || [];
		const capabilityProps = {
			info,
			realtimeUpdates,
		};

		switch (capability.type) {
			case CapabilityModel.Type.LIGHT_SENSOR:
				return <LightSensorCapabilityComponent {...capabilityProps} />;

			default:
				console.warn(`capability type "${capability.type}" is not supported`);

				return null;
		}
	}

	renderChildDeviceList(childDevices) {
		if (childDevices.length === 0) {
			return null;
		}

		return (
			<List>
				<Subheader>Child devices</Subheader>
				{childDevices.map(this.renderChildDeviceListItem)}
			</List>
		);
	}

	renderChildDeviceListItem(device) {
		return (
			<ListItem
				key={device.id}
				primaryText={device.name}
				onTouchTap={() => browserHistory.push(`/device/${device.id}`)}
			/>
		);
	}

	getBackgroundImage(info) {
		const modelToBackgroundMap = {
			RaspPi: '/gfx/images/Devices/raspberry.jpg',
		};
		const typeToBackgroundMap = {
			c8y_Linux: '/gfx/images/Devices/computer.jpg',
			Light: '/gfx/images/devices/light.jpg',
			Motion: '/gfx/images/devices/motion.jpg',
		};
		let backgroundImage = null;

		backgroundImage = Object.keys(modelToBackgroundMap).reduce((background, pattern) => {
			const regexp = new RegExp(pattern);

			if (regexp.test(info.model)) {
				background = modelToBackgroundMap[pattern]; // eslint-disable-line
			}

			return background;
		}, backgroundImage);

		if (backgroundImage === null) {
			backgroundImage = typeof typeToBackgroundMap[info.type] !== 'undefined'
				? typeToBackgroundMap[info.type]
				: typeToBackgroundMap[Object.keys(typeToBackgroundMap)[0]];
		}

		return backgroundImage;
	}

	setupRealtimeUpdates(deviceId) {
		const channel = this.getDeviceMeasurementsChannelName(deviceId);

		this.props.getRealtimeUpdates(channel);
	}

	stopRealtimeUpdates(deviceId) {
		const channel = this.getDeviceMeasurementsChannelName(deviceId);

		this.props.stopRealtimeUpdates(channel);
	}

	getDeviceMeasurementsChannelName(deviceId) {
		return `/measurements/${deviceId}`;
	}
}

export default connect(
	state => ({
		device: state.device,
		realtime: state.realtime,
	}), {
		...platformActions,
	}
)(DeviceView);
