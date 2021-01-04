import {
	Project,
	ProjectActionTypes,
	CREATE_PROJECT_START,
	CREATE_PROJECT_SUCCESS,
	SET_ALL_PROJECTS,
	EDIT_PROJECT_START,
	EDIT_PROJECT_SUCCESS,
} from './project.types';

export function createProjectStart(newProject: Project): ProjectActionTypes {
	return {
		type: CREATE_PROJECT_START,
		payload: newProject,
	};
}

export function createProjectSuccess(newProject: Project): ProjectActionTypes {
	return {
		type: CREATE_PROJECT_SUCCESS,
		payload: newProject,
	};
}

export function setAllProjects(projects: Project[]): ProjectActionTypes {
	return {
		type: SET_ALL_PROJECTS,
		payload: projects,
	};
}

export function editProjectStart(project: Project): ProjectActionTypes {
	return {
		type: EDIT_PROJECT_START,
		payload: project,
	};
}

export function editProjectSuccess(project: Project): ProjectActionTypes {
	return {
		type: EDIT_PROJECT_SUCCESS,
		payload: project,
	};
}
