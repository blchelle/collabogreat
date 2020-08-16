import { Project, ProjectActionTypes, CREATE_PROJECT, SET_ALL_PROJECTS } from './project.types';

const initialState: Project[] = [];

export function projectReducer(state = initialState, action: ProjectActionTypes): Project[] {
	switch (action.type) {
		case CREATE_PROJECT:
			return [...state, action.payload];
		case SET_ALL_PROJECTS:
			return action.payload;
		default:
			return state;
	}
}
