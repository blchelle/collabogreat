import { Task } from '../tasks/tasks.types';
import {
	User,
	UserActionTypes,
	FETCH_CURRENT_USER,
	SET_CURRENT_USER,
	LOGOUT_START,
	ADD_PROJECT_TO_USER,
	ACCEPT_INVITE_START,
	REJECT_INVITE_START,
	DISMISS_TASK_START,
	ACCEPT_INVITE_SUCCESS,
	DISMISS_TASK_SUCCESS,
	REJECT_INVITE_SUCCESS,
	LEAVE_PROJECT_START,
	LEAVE_PROJECT_SUCCESS,
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

export function leaveProjectStart(projectId: string): UserActionTypes {
	return {
		type: LEAVE_PROJECT_START,
		payload: { projectId },
	};
}

export function leaveProjectSuccess(projectId: string): UserActionTypes {
	return {
		type: LEAVE_PROJECT_SUCCESS,
		payload: { projectId },
	};
}

export function acceptInviteStart(
	projects: string[],
	projectInvitations: Partial<User>[],
	acceptedInviteId: string,
	myId: string
): UserActionTypes {
	return {
		type: ACCEPT_INVITE_START,
		payload: { projects, projectInvitations, acceptedInviteId, myId },
	};
}

export function acceptInviteSuccess(projectId: string): UserActionTypes {
	return {
		type: ACCEPT_INVITE_SUCCESS,
		payload: { projectId },
	};
}

export function rejectInviteStart(
	inviteId: string,
	projectInvitations: Partial<User>[]
): UserActionTypes {
	return {
		type: REJECT_INVITE_START,
		payload: { inviteId, projectInvitations },
	};
}

export function rejectInviteSuccess(projectId: string): UserActionTypes {
	return {
		type: REJECT_INVITE_SUCCESS,
		payload: { projectId },
	};
}

export function dismissTaskStart(taskId: string, newTasks: Partial<Task>[]): UserActionTypes {
	return {
		type: DISMISS_TASK_START,
		payload: { taskId, newTasks },
	};
}

export function dismissTaskSuccess(taskId: string): UserActionTypes {
	return {
		type: DISMISS_TASK_SUCCESS,
		payload: { taskId },
	};
}
