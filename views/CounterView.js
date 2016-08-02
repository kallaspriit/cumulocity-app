import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { increase, decrease } from '../actions/counter';

function Counter(props) {
	return (
		<div>
			<p>Clicked: {props.number} times</p>
			<div>
				<button onClick={() => props.increase(1)}>Increase</button>
				<button onClick={() => props.decrease(1)}>Decrease</button>
			</div>
		</div>
	);
}

Counter.propTypes = {
	number: PropTypes.number.isRequired,
	increase: PropTypes.func.isRequired,
	decrease: PropTypes.func.isRequired,
};

export default connect(
	state => ({ number: state.counter.number }),
	{ increase, decrease }
)(Counter);
