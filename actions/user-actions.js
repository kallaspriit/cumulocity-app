import { createAction } from 'redux-actions';
import { FETCH_USER } from '../constants';

export const fetchUser = createAction(FETCH_USER, (id) => {
	console.log(`fetching user #${id}`);

	return id;
});
