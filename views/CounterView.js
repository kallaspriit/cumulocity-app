import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as counterActions from '../actions/counter-actions';

import HeaderComponent from './components/HeaderComponent';

function CounterView({
	number,
	increase,
	decrease,
}) {
	return (
		<div>
			<HeaderComponent title="Counter" />
			<p>Clicked: {number} times!</p>
			<div>
				<button onClick={() => increase(1)}>Increase</button>
				<button onClick={() => decrease(1)}>Decrease</button>
			</div>
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
