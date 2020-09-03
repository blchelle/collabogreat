import {
	User,
	UserActionTypes,
	FETCH_CURRENT_USER,
	SET_CURRENT_USER,
	ADD_PROJECT_TO_USER,
} from './user.types';

export function fetchCurrentUser(): UserActionTypes {
	return {
		type: FETCH_CURRENT_USER,
	};
}

export function setCurrentUser(user: User): UserActionTypes {
	return {
		type: SET_CURRENT_USER,
		payload: user,
	};
}

export function addProjectToUser(projectId: string): UserActionTypes {
	return {
		type: ADD_PROJECT_TO_USER,
		payload: projectId,
	};
}
