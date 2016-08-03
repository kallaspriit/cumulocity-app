import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as counterActions from '../actions/counter-actions';

import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import FlatButton from 'material-ui/FlatButton';

import HeaderComponent from './components/HeaderComponent';

function CounterView({
	number,
	increase,
	decrease,
}) {
	return (
		<div>
  			<HeaderComponent title="Light sensor" />
			<Card>
				<CardHeader
					title="Priit Kallas"
					subtitle="Lai 29 4th floor"
					avatar="/gfx/images/avatar.png"
				/>
				<CardMedia
					overlay={
						<CardTitle
							title="Light sensor"
							subtitle="Connected to Raspberry Pi"
						/>
					}
				>
					<img
						src="/gfx/images/sensor-light.png"
					/>
				</CardMedia>
				<CardText>
					Clicked: {number} times
				</CardText>
				<CardActions>
					<FlatButton label="Increase" onTouchTap={() => increase(1)} />
					<FlatButton label="Decrease" onTouchTap={() => decrease(1)} />
				</CardActions>
			</Card>
  		</div>
	);
}

CounterView.propTypes = {
	number: PropTypes.number.isRequired,
	increase: PropTypes.func.isRequired,
	decrease: PropTypes.func.isRequired,
};

export default connect(
	state => ({ number: state.counter.number }),
	{
		...counterActions,
	}
)(CounterView);
