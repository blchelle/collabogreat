import { Project } from '../project/project.types';

export type User = {
	_id: string;
	displayName: string;
	email: string;
	image: string;
	projects: string[];
	projectInvitations: Partial<Project>[];
} | null;

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOGOUT_START = 'LOGOUT_START';
export const ADD_PROJECT_TO_USER = 'ADD_PROJECT_TO_USER';
export const ACCEPT_INVITE_START = 'ACCEPT_INVITE_START';
export const REJECT_INVITE_START = 'REJECT_INVITE_START';

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

export interface RejectInviteStartAction {
	type: typeof REJECT_INVITE_START;
	payload: {
		inviteId: string;
		projectInvitations: Partial<User>[];
	};
}

export type UserActionTypes =
	| FetchCurrentUserAction
	| SetCurrentUserAction
	| LogoutStartAction
	| AddProjectToUserAction
	| AcceptInviteStartAction
	| RejectInviteStartAction;
