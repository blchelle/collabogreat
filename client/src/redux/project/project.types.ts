export interface Project {
	_id: string;
	title: string;
	image: string;
}

export const SET_ALL_PROJECTS = 'SET_ALL_PROJECTS';
export const CREATE_PROJECT = 'CREATE_PROJECT';

interface CreateProjectAction {
	type: typeof CREATE_PROJECT;
	payload: Project;
}

interface SetAllProjectsAction {
	type: typeof SET_ALL_PROJECTS;
	payload: Project[];
}

export type ProjectActionTypes = CreateProjectAction | SetAllProjectsAction;
