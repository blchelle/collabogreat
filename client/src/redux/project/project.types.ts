import { User } from '../user/user.types';

export interface Project {
	_id?: string;
	title: string;
	description: string;
	image?: string;
	members?: Partial<User>[];
	board: string[];
}

export const SET_ALL_PROJECTS = 'SET_ALL_PROJECTS';
export const CREATE_PROJECT_START = 'CREATE_PROJECT_START';
export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS';
export const EDIT_PROJECT_START = 'EDIT_PROJECT_START';
export const EDIT_PROJECT_SUCCESS = 'EDIT_PROJECT_SUCCESS';

interface CreateProjectStartAction {
	type: typeof CREATE_PROJECT_START;
	payload: Project;
}

interface CreateProjectSuccessAction {
	type: typeof CREATE_PROJECT_SUCCESS;
	payload: Project;
}

interface SetAllProjectsAction {
	type: typeof SET_ALL_PROJECTS;
	payload: Project[];
}

interface EditProjectStartAction {
	type: typeof EDIT_PROJECT_START;
	payload: Project;
}

interface EditProjectSuccessAction {
	type: typeof EDIT_PROJECT_SUCCESS;
	payload: Project;
}

export type ProjectActionTypes =
	| CreateProjectStartAction
	| CreateProjectSuccessAction
	| SetAllProjectsAction
	| EditProjectStartAction
	| EditProjectSuccessAction;
