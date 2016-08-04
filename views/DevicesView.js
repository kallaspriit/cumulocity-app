import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';

import HeaderComponent from './components/HeaderComponent';

class DevicesView extends Component {
	render() {
		return (
			<div className="devices-view">
				<HeaderComponent title="Devices" />
				<Card className="main-contents">
					<CardText>
						...
					</CardText>
				</Card>
			</div>
		);
	}
}

export default connect(
	state => ({}),
	{}
)(DevicesView);
