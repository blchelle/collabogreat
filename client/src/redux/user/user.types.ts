import { Task } from '../tasks/tasks.types';
import { Project } from '../project/project.types';

export type User = {
	_id: string;
	displayName: string;
	email: string;
	image: string;
	projects: string[];
	projectInvitations: Partial<Project>[];
	newTasks: Partial<Task>[];
} | null;

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOGOUT_START = 'LOGOUT_START';
export const ADD_PROJECT_TO_USER = 'ADD_PROJECT_TO_USER';
export const ACCEPT_INVITE_START = 'ACCEPT_INVITE_START';
export const ACCEPT_INVITE_SUCCESS = 'ACCEPT_INVITE_SUCCESS';

export const REJECT_INVITE_START = 'REJECT_INVITE_START';
export const REJECT_INVITE_SUCCESS = 'REJECT_INVITE_SUCCESS';

export const DISMISS_TASK_START = 'DISMISS_TASK_START';
export const DISMISS_TASK_SUCCESS = 'DISMISS_TASK_SUCCESS';

interface FetchCurrentUserAction {
	type: typeof FETCH_CURRENT_USER;
}

interface SetCurrentUserAction {
	type: typeof SET_CURRENT_USER;
	payload: User;
}

interface LogoutStartAction {
	type: typeof LOGOUT_START;
}

interface AddProjectToUserAction {
	type: typeof ADD_PROJECT_TO_USER;
	payload: string;
}

export interface AcceptInviteStartAction {
	type: typeof ACCEPT_INVITE_START;
	payload: {
		projects: string[];
		projectInvitations: Partial<User>[];
		acceptedInviteId: string;
		myId: string;
	};
}

export interface AcceptInviteSuccessAction {
	type: typeof ACCEPT_INVITE_SUCCESS;
	payload: {
		projectId: string;
	};
}

export interface RejectInviteStartAction {
	type: typeof REJECT_INVITE_START;
	payload: {
		inviteId: string;
		projectInvitations: Partial<User>[];
	};
}

export interface RejectInviteSuccessAction {
	type: typeof REJECT_INVITE_SUCCESS;
	payload: {
		projectId: string;
	};
}

export interface DismissTaskStartAction {
	type: typeof DISMISS_TASK_START;
	payload: {
		taskId: string;
		newTasks: Partial<Task>[];
	};
}

export interface DismissTaskSuccessAction {
	type: typeof DISMISS_TASK_SUCCESS;
	payload: {
		taskId: string;
	};
}

export type UserActionTypes =
	| FetchCurrentUserAction
	| SetCurrentUserAction
	| LogoutStartAction
	| AddProjectToUserAction
	| AcceptInviteStartAction
	| AcceptInviteSuccessAction
	| RejectInviteStartAction
	| RejectInviteSuccessAction
	| DismissTaskStartAction
	| DismissTaskSuccessAction;
