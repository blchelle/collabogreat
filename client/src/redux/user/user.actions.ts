import { User, UserActionTypes, FETCH_CURRENT_USER, SET_CURRENT_USER } from './user.types';

export function fetchCurrentUser(): UserActionTypes {
	return {
		type: FETCH_CURRENT_USER,
	};
}

export function setCurrentUser(user: User) {
	return {
		type: SET_CURRENT_USER,
		payload: user,
	};
}
