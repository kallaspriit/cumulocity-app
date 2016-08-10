import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CircularProgress from 'material-ui/CircularProgress';

import MeasurementModel from '../../../models/MeasurementModel';
import GaugeComponent from '../GaugeComponent';

class LightSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	render() {
		return (
			<div className="capability-component light-sensor-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		const {
			measurements,
		} = this.props;

		const measurement = measurements.find(
			(item) => item.type === MeasurementModel.Type.LIGHT
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const value = measurement.info.e.value;
		const unit = measurement.info.e.unit;

		return (
			<GaugeComponent
				title="Light intensity"
				unit={unit}
				height={200}
				min={0}
				max={100}
				value={value}
			/>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(LightSensorCapabilityComponent);
