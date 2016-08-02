import { createAction } from 'redux-actions';
import { INCREASE, DECREASE } from '../constants';

export const increase = createAction(INCREASE, amount => amount);
export const decrease = createAction(DECREASE, amount => amount);
