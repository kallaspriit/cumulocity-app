import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';

import HeaderComponent from './components/HeaderComponent';
import GaugeComponent from './components/GaugeComponent';

function DeviceView({
	params,
}) {
	const {
		deviceId,
	} = params;

	return (
		<div className="device-view">
			<HeaderComponent title="Raspberry Pi" />
			<Card className="main-contents">
				<CardHeader
					title="Priit Kallas"
					subtitle="Lai 29 4th floor"
					avatar="/gfx/images/avatar.png"
				/>
				<CardMedia
					overlay={
						<CardTitle
							title={`Light sensor ${deviceId}`}
							subtitle="Connected to Raspberry Pi"
						/>
					}
				>
					<img
						src="/gfx/images/sensor-light.png"
						alt="Light sensor"
					/>
				</CardMedia>
				<CardText>
					<div className="gauge-wrap">
						<GaugeComponent
							title="Light intensity"
							unit="lux"
							height={200}
							min={0}
							max={100}
							value={Math.round(Math.random() * 100)}
						/>
					</div>
				</CardText>
			</Card>
		</div>
	);
}

DeviceView.propTypes = {
	params: PropTypes.object.isRequired,
};

export default connect(
	state => ({
	}), {
	}
)(DeviceView);
