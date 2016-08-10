import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import MeasurementModel from '../../../models/MeasurementModel';

class MotionSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	render() {
		return (
			<div className="capability-component motion-sensor-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		const {
			measurements,
		} = this.props;

		const measurement = measurements.find(
			(item) => item.type === MeasurementModel.Type.MOTION
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const isMotionDetected = measurement.info.state.value === 1;

		const className = classNames(
			'motion-status-wrap', {
				'is-motion-detected': isMotionDetected,
			}
		);

		return (
			<div className={className}>
				{isMotionDetected ? 'Motion detected' : 'No motion currently detected'}
			</div>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(MotionSensorCapabilityComponent);
