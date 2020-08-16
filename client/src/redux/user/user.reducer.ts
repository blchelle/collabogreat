import { User, UserActionTypes, SET_CURRENT_USER } from './user.types';

const initialState: User = null;

export function userReducer(state = initialState, action: UserActionTypes): User {
	switch (action.type) {
		case SET_CURRENT_USER:
			return action.payload;
		default:
			return state;
	}
}
