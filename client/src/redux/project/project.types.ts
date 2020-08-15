export interface Project {
	_id: string;
	title: string;
	image: string;
}

export const CREATE_PROJECT = 'CREATE_PROJECT';

interface CreateProjectAction {
	type: typeof CREATE_PROJECT;
	payload: Project;
}

export type ProjectActionTypes = CreateProjectAction;
