import {
	User,
	UserActionTypes,
	FETCH_CURRENT_USER,
	SET_CURRENT_USER,
	LOGOUT_START,
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

export function logoutStart(): UserActionTypes {
	return {
		type: LOGOUT_START,
	};
}

// TODO: I'm trying to accomplish a more modular action for this that can
// modify any user attribute instead of only specific ones
export function addProjectToUser(projectId: string): UserActionTypes {
	return {
		type: ADD_PROJECT_TO_USER,
		payload: projectId,
	};
}
