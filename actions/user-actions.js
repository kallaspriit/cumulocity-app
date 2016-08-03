import { createAction } from 'redux-actions';
import userApi from '../apis/user-api';
import { FETCH_USER } from '../constants';

export const fetchUser = createAction(FETCH_USER, userApi.fetchUser);
