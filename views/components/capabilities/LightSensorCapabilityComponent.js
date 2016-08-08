import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import GaugeComponent from '../GaugeComponent';

class LightSensorCapabilityComponent extends Component {

	static propTypes = {
		device: PropTypes.object.isRequired,
	};

	render() {
		return (
			<div className="light-sensor-capability-component">
				<GaugeComponent
					title="Light intensity"
					unit="lux"
					height={200}
					min={0}
					max={100}
					value={Math.round(Math.random() * 100)}
				/>
			</div>
		);
	}

}

export default connect(
	state => ({
	}), {
	}
)(LightSensorCapabilityComponent);
