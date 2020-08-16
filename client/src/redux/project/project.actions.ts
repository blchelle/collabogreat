import { Project, CREATE_PROJECT, SET_ALL_PROJECTS, ProjectActionTypes } from './project.types';

export function createProject(newProject: Project): ProjectActionTypes {
	return {
		type: CREATE_PROJECT,
		payload: newProject,
	};
}

export function setAllProjects(projects: Project[]): ProjectActionTypes {
	return {
		type: SET_ALL_PROJECTS,
		payload: projects,
	};
}
