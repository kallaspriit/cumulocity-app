import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CircularProgress from 'material-ui/CircularProgress';

import MeasurementModel from '../../../models/MeasurementModel';
import GaugeComponent from '../GaugeComponent';

class LightSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		realtimeUpdates: PropTypes.array.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			isValid: false,
			value: 0,
			unit: '',
		};
	}

	componentWillReceiveProps(nextProps) {
		const {
			realtimeUpdates,
		} = nextProps;

		const measurement = this.getRealtimeMeasurement(realtimeUpdates);

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

	getRealtimeMeasurement(updates) {
		let measurement = null;

		for (let i = 0; i < updates.length; i++) {
			for (let j = 0; j < updates[i].length; j++) {
				const item = updates[i][j];

				if (item.type === MeasurementModel.Type.LIGHT) {
					measurement = item;

					break;
				}
			}
		}

		if (!measurement) {
			return null;
		}

		return {
			value: measurement.info.e.value,
			unit: measurement.info.e.unit,
		};
	}

}

export default connect(
	state => ({
	}), {
	}
)(LightSensorCapabilityComponent);
