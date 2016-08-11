import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import CapabilityModel from '../../../models/CapabilityModel';
import MeasurementModel from '../../../models/MeasurementModel';

class RelayActuatorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	static getType() {
		return CapabilityModel.Type.RELAY;
	}

	render() {
		return (
			<div className="capability-component relay-actuator-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		const {
			measurements,
		} = this.props;

		const measurement = measurements.find(
			(item) => item.type === MeasurementModel.Type.RELAY
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const isRelayActive = measurement.info.state.value === 1;

		const className = classNames(
			'relay-status-wrap', {
				'is-relay-active': isRelayActive,
			}
		);

		return (
			<div className={className}>
				{isRelayActive ? 'Relay is activated' : 'Relay is not activated'}
			</div>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(RelayActuatorCapabilityComponent);
