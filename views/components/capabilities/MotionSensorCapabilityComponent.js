import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CircularProgress from 'material-ui/CircularProgress';

import MeasurementModel from '../../../models/MeasurementModel';

class MotionSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			isValid: false,
			isMotionDetected: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		const {
			measurements,
		} = nextProps;

		const measurement = measurements.find(
			(item) => item.type === MeasurementModel.Type.MOTION
		) || null;

		if (measurement !== null) {
			this.setState({
				isValid: true,
				isMotionDetected: measurement.info.state.value === 1,
			});
		}
	}

	render() {
		return (
			<div className="capability-component motion-sensor-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		if (!this.state.isValid) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		return (
			<div>{this.state.isMotionDetected ? 'Motion detected!' : 'No motion currently detected'}</div>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(MotionSensorCapabilityComponent);
