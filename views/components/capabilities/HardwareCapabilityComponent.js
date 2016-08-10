import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import changeCase from 'change-case';

class HardwareCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	render() {
		return (
			<div className="hardware-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		return (
			<ul className="info-list">
				{Object.keys(this.props.capability.info).map(
					(key) => this.renderHardwareListItem(key, this.props.capability.info[key])
				)}
			</ul>
		);
	}

	renderHardwareListItem(key, value) {
		return (
			<li key={key}>
				<strong>{changeCase.sentenceCase(key)}:</strong> {value}
			</li>
		);
	}
}

export default connect(
	state => ({
	}), {
	}
)(HardwareCapabilityComponent);
