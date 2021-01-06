import {
	Task,
	TaskActionTypes,
	CREATE_TASK_START,
	CREATE_TASK_SUCCESS,
	FETCH_TASKS_START,
	FETCH_TASKS_SUCCESS,
	EDIT_TASKS_START,
	EDIT_TASKS_SUCCESS,
	DELETE_TASK_START,
	DELETE_TASK_SUCCESS,
} from './tasks.types';

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

export function editTasksStart(tasks: Task[]): TaskActionTypes {
	return {
		type: EDIT_TASKS_START,
		payload: tasks,
	};
}

export function editTasksSuccess(tasks: Task[]): TaskActionTypes {
	return {
		type: EDIT_TASKS_SUCCESS,
		payload: tasks,
	};
}

export function deleteTaskStart(task: Task): TaskActionTypes {
	return {
		type: DELETE_TASK_START,
		payload: task,
	};
}

export function deleteTaskSuccess(taskId: string): TaskActionTypes {
	return {
		type: DELETE_TASK_SUCCESS,
		payload: taskId,
	};
}
