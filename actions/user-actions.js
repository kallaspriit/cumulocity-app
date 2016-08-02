import { createAction } from 'redux-actions';
import { FETCH_USER } from '../constants';

export const fetchUser = (id) => (dispatch) => {
	console.log(`fetching user #${id}`);

	setTimeout(() => {
		const userInfo = {
			id: 1,
			name: `Jack Daniels #${id}`,
		};

		console.log('dispatching user', userInfo);

		dispatch(
			createAction(FETCH_USER)(userInfo)
		);
	}, 1000);

	/*
	return {
		id: 1,
		name: `Jack Daniels #${id}`,
	};
	*/
};
