import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';

import HeaderComponent from './components/HeaderComponent';
import AsyncComponent from './components/AsyncComponent';
import GaugeComponent from './components/GaugeComponent';

import * as platformActions from '../actions/platform-actions';

class DeviceView extends Component {

	static propTypes = {
		params: PropTypes.object.isRequired,
		device: PropTypes.object.isRequired,

		getDevice: PropTypes.func.isRequired,
	};

	componentDidMount() {
		this.props.getDevice(this.props.params.deviceId);
	}

	render() {
		const {
			device,
		} = this.props;

		const title = !device.info ? 'Loading device info...' : device.info.name;

		return (
			<div className="device-view">
				<HeaderComponent title={title} />
				<AsyncComponent info={device} render={this.renderDevice.bind(this)} />
			</div>
		);
	}

	renderDevice(info) {
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
							title="Light sensor"
							subtitle={`Connected to ${info.name}`}
						/>
					}
				>
					<img
						src="/gfx/images/sensor-light.png"
						alt="Light sensor"
					/>
				</CardMedia>
				<CardText>
					<div className="gauge-wrap">
						<GaugeComponent
							title="Light intensity"
							unit="lux"
							height={200}
							min={0}
							max={100}
							value={Math.round(Math.random() * 100)}
						/>
					</div>
				</CardText>
			</Card>
		);
	}
}

export default connect(
	state => ({
		device: state.device,
	}), {
		...platformActions,
	}
)(DeviceView);
