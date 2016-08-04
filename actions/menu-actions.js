import { createAction } from 'redux-actions';
import { OPEN_MAIN_MENU, CLOSE_MAIN_MENU } from '../constants';

export const openMainMenu = createAction(OPEN_MAIN_MENU);
export const closeMainMenu = createAction(CLOSE_MAIN_MENU);
