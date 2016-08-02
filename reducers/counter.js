import { handleActions } from 'redux-actions';
import { INCREASE, DECREASE } from '../constants';

const defaultState = {
	number: 1,
};

export default handleActions({
	[INCREASE]: (state, action) => ({
		number: state.number + action.payload,
	}),
	[DECREASE]: (state, action) => ({
		number: state.number - action.payload,
	}),
}, defaultState);
