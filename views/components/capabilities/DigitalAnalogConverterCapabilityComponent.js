import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AbstractPlatform from '../../../src/AbstractPlatform';

class DigitalAnalogConverterCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.DIGITAL_ANALOG_CONVERTER;
	}

	render() {
		return (
			<div className="capability-component digital-analog-converter-capability-component">
				<div className="output-info">
					Latest output: <strong>{this.props.capability.info.value}%</strong>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
	}), {
	}
)(DigitalAnalogConverterCapabilityComponent);
