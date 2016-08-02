import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as counterActions from '../actions/counter-actions';

function CounterView({
	number,
	increase,
	decrease,
}) {
	return (
		<div>
			<h2>Counter view</h2>
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
