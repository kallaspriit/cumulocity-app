import createApiAction from '../util/create-api-action';
import { FETCH_USER } from '../constants';
import userApi from '../apis/user-api';

export const fetchUser = createApiAction(FETCH_USER, userApi.fetchUser);
