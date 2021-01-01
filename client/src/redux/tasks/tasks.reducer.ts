import {
	Task,
	TaskActionTypes,
	REORDER_TASKS,
	MOVE_TASK,
	CREATE_TASK_SUCCESS,
	FETCH_TASKS_SUCCESS,
} from './tasks.types';
import { reorderTasks, moveTasks } from './tasks.util';

const initialState: Task[] = [];

export function taskReducer(state = initialState, action: TaskActionTypes): Task[] {
	switch (action.type) {
		case REORDER_TASKS:
			return reorderTasks(state, action.payload.task, action.payload.oldOrder);
		case MOVE_TASK:
			return moveTasks(
				state,
				action.payload.taskId,
				action.payload.projectId,
				action.payload.oldIndex,
				action.payload.oldStatus,
				action.payload.newIndex,
				action.payload.newStatus
			);
		case CREATE_TASK_SUCCESS:
			return [...state, action.payload];
		case FETCH_TASKS_SUCCESS:
			return action.payload;
		default:
			return state;
	}
}
