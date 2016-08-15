import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CircularProgress from 'material-ui/CircularProgress';

import CapabilityModel from '../../../models/CapabilityModel';
import MeasurementModel from '../../../models/MeasurementModel';
import GaugeComponent from '../GaugeComponent';
import RangeChartComponent from '../RangeChartComponent';

class LightSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
		measurementSeries: PropTypes.object.isRequired,
	};

	static getType() {
		return CapabilityModel.Type.LIGHT;
	}

	render() {
		return (
			<div className="capability-component light-sensor-capability-component">
				{this.renderGauge()}
				{this.renderRangeChart()}
			</div>
		);
	}

	renderGauge() {
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
				title="Current intensity"
				unit={unit}
				height={200}
				min={0}
				max={100}
				value={value}
			/>
		);
	}

	renderRangeChart() {
		const {
			measurementSeries,
		} = this.props;

		const lightMeasurements = measurementSeries[MeasurementModel.Type.LIGHT];

		if (!lightMeasurements) {
			return null;
		}

		return (
			<RangeChartComponent
				title="Intensity history"
				height={200}
				data={lightMeasurements}
			/>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(LightSensorCapabilityComponent);
