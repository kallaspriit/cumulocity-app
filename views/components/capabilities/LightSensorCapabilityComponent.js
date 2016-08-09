import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CircularProgress from 'material-ui/CircularProgress';

import GaugeComponent from '../GaugeComponent';

class LightSensorCapabilityComponent extends Component {

	static propTypes = {
		device: PropTypes.object.isRequired,
		realtimeInfo: PropTypes.array.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			isValid: false,
			value: 0,
			unit: '',
		};
	}

	componentWillReceiveProps(newProps) {
		const {
			realtimeInfo,
		} = this.props;

		const measurement = this.getRealtimeMeasurement(realtimeInfo);

		if (measurement !== null) {
			this.setState({
				isValid: true,
				value: measurement.value,
				unit: measurement.unit,
			});
		}
	}

	render() {
		return (
			<div className="light-sensor-capability-component">
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
			<GaugeComponent
				title="Light intensity"
				unit={this.state.unit}
				height={200}
				min={0}
				max={100}
				value={this.state.value}
			/>
		);
	}

	getRealtimeMeasurement(realtimeInfo) {
		// TODO cumulocity specific
		const measurement = realtimeInfo.find(
			(item) => item.type === 'c8y_LightSensor'
		) || null;

		if (!measurement) {
			return null;
		}

		return {
			value: measurement.c8y_LightMeasurement.e.value,
			unit: measurement.c8y_LightMeasurement.e.unit,
		};
	}

}

export default connect(
	state => ({
	}), {
	}
)(LightSensorCapabilityComponent);
