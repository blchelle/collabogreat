import {
	User,
	UserActionTypes,
	SET_CURRENT_USER,
	ADD_PROJECT_TO_USER,
	ACCEPT_INVITE_SUCCESS,
	DISMISS_TASK_SUCCESS,
	REJECT_INVITE_SUCCESS,
} from './user.types';

const initialState: User = null;

export function userReducer(state = initialState, action: UserActionTypes): User {
	switch (action.type) {
		case SET_CURRENT_USER:
			return action.payload;
		case ADD_PROJECT_TO_USER:
			if (state) return { ...state, projects: [...state.projects, action.payload] };
			return null;
		case ACCEPT_INVITE_SUCCESS:
			if (state)
				return {
					...state,
					projects: [...state.projects, action.payload.projectId],
					projectInvitations: state.projectInvitations.filter(
						(invite) => invite._id !== action.payload.projectId
					),
				};
			return null;
		case REJECT_INVITE_SUCCESS:
			if (state)
				return {
					...state,
					projectInvitations: state.projectInvitations.filter(
						(invite) => invite._id !== action.payload.projectId
					),
				};
			return null;
		case DISMISS_TASK_SUCCESS:
			if (state)
				return {
					...state,
					newTasks: state.newTasks.filter((task) => task._id !== action.payload.taskId),
				};
			return null;
		default:
			return state;
	}
}
