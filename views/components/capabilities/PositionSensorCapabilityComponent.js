import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AbstractPlatform from '../../../src/AbstractPlatform';

class PositionSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.POSITION;
	}

	render() {
		return (
			<div className="capability-component position-sensor-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		return (
			<div>
				POSITION
				<ul>
					<li><strong>Latitude:</strong> {this.props.capability.info.lat}</li>
					<li><strong>Longitude:</strong> {this.props.capability.info.lng}</li>
					<li><strong>Altitude:</strong> {this.props.capability.info.alt}</li>
				</ul>
			</div>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(PositionSensorCapabilityComponent);
