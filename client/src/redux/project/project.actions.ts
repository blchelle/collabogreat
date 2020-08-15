import { Project, CREATE_PROJECT, ProjectActionTypes } from './project.types';

export function createProject(newProject: Project): ProjectActionTypes {
	return {
		type: CREATE_PROJECT,
		payload: newProject,
	};
}
