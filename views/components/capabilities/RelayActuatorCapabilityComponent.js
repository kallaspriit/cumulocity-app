import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';

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
		const isDataAvailable = this.getMeasurement() !== null;

		if (!isDataAvailable) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const isRelayActive = this.getIsActive();
		const className = classNames(
			'relay-status-wrap', {
				'is-relay-active': isRelayActive,
			}
		);

		return (
			<div className={className}>
				<Toggle
					label={isRelayActive ? 'Activated' : 'Not activated'}
					toggled={isRelayActive}
					onToggle={() => this.handleToggle()}
				/>
			</div>
		);
	}

	handleToggle() {
		const isActive = this.getIsActive();

		console.log('handleToggle', isActive);
	}

	getMeasurement() {
		const {
			measurements,
		} = this.props;

		return measurements.find(
			(item) => item.type === MeasurementModel.Type.RELAY
		) || null;
	}

	getIsActive() {
		const measurement = this.getMeasurement();

		if (!measurement) {
			return false;
		}

		return measurement.info.state.value === 1;
	}

}

export default connect(
	state => ({
	}), {
	}
)(RelayActuatorCapabilityComponent);
