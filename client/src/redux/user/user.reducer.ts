import { User, UserActionTypes, SET_CURRENT_USER, ADD_PROJECT_TO_USER } from './user.types';

const initialState: User = null;

export function userReducer(state = initialState, action: UserActionTypes): User {
	switch (action.type) {
		case SET_CURRENT_USER:
			return action.payload;
		case ADD_PROJECT_TO_USER:
			if (state) return { ...state, projects: [...state.projects, action.payload] };
			return null;
		default:
			return state;
	}
}
