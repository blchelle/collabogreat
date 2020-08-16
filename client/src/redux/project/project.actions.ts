import { Project, ProjectActionTypes, CREATE_PROJECT, SET_ALL_PROJECTS } from './project.types';

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
