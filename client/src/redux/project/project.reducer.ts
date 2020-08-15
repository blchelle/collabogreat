import { Project, ProjectActionTypes, CREATE_PROJECT } from './project.types';

const initialState: Project[] = [];

export function projectReducer(state = initialState, action: ProjectActionTypes): Project[] {
	switch (action.type) {
		case CREATE_PROJECT:
			return [...state, action.payload];
		default:
			return state;
	}
}
