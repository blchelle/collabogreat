import {
	Project,
	ProjectActionTypes,
	SET_ALL_PROJECTS,
	CREATE_PROJECT_SUCCESS,
} from './project.types';

const initialState: Project[] = [];

export function projectReducer(state = initialState, action: ProjectActionTypes): Project[] {
	switch (action.type) {
		case SET_ALL_PROJECTS:
			return action.payload;
		case CREATE_PROJECT_SUCCESS:
			return [...state, action.payload];
		default:
			return state;
	}
}
