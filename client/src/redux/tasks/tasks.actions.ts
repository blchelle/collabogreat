import {
	Task,
	TaskActionTypes,
	REORDER_TASKS,
	MOVE_TASK,
	CREATE_TASK_START,
	CREATE_TASK_SUCCESS,
	FETCH_TASKS_START,
	FETCH_TASKS_SUCCESS,
} from './tasks.types';

export function reorderTasks(reorderInfo: { task: Task; oldOrder: number }): TaskActionTypes {
	return {
		type: REORDER_TASKS,
		payload: reorderInfo,
	};
}

export function moveTask(moveInfo: {
	taskId: string;
	projectId: string;
	oldIndex: number;
	oldStatus: string;
	newIndex: number;
	newStatus: string;
}): TaskActionTypes {
	return {
		type: MOVE_TASK,
		payload: moveInfo,
	};
}

export function createTaskStart(newTask: Task): TaskActionTypes {
	return {
		type: CREATE_TASK_START,
		payload: newTask,
	};
}

export function createTaskSuccess(newTask: Task): TaskActionTypes {
	return {
		type: CREATE_TASK_SUCCESS,
		payload: newTask,
	};
}

export function fetchTasksStart(projectIds: string[]): TaskActionTypes {
	return {
		type: FETCH_TASKS_START,
		payload: projectIds,
	};
}

export function fetchTasksSuccess(tasks: Task[]): TaskActionTypes {
	return {
		type: FETCH_TASKS_SUCCESS,
		payload: tasks,
	};
}
