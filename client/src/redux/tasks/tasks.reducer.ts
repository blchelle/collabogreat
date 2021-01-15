import {
	Task,
	TaskActionTypes,
	CREATE_TASK_SUCCESS,
	FETCH_TASKS_SUCCESS,
	EDIT_TASKS_SUCCESS,
	DELETE_TASK_SUCCESS,
} from './tasks.types';
import { updateTasks } from './tasks.util';
const initialState: Task[] = [];

export function taskReducer(state = initialState, action: TaskActionTypes): Task[] {
	switch (action.type) {
		case EDIT_TASKS_SUCCESS:
			return updateTasks(state, action.payload);
		case CREATE_TASK_SUCCESS:
			return [...state, action.payload];
		case FETCH_TASKS_SUCCESS:
			return action.payload;
		case DELETE_TASK_SUCCESS:
			return state.filter(({ _id }) => _id !== action.payload);
		default:
			return state;
	}
}
