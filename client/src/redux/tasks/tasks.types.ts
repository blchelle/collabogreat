export interface Task {
	_id: string;
	title: string;
	description?: string;
	status: string;
	order: number;
	user: string;
	project: string;
}

export const REORDER_TASKS = 'REORDER_TASKS';
export const MOVE_TASK = 'MOVE_TASK';
export const CREATE_TASK_START = 'CREATE_TASK_START';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const FETCH_TASKS_START = 'FETCH_TASKS_START';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';

interface ReorderTasksAction {
	type: typeof REORDER_TASKS;
	payload: {
		task: Task;
		oldOrder: number;
	};
}

interface MoveTaskAction {
	type: typeof MOVE_TASK;
	payload: {
		taskId: string;
		projectId: string;
		oldIndex: number;
		oldStatus: string;
		newIndex: number;
		newStatus: string;
	};
}

interface CreateTaskStartAction {
	type: typeof CREATE_TASK_START;
	payload: Task;
}

interface CreateTaskSuccessAction {
	type: typeof CREATE_TASK_SUCCESS;
	payload: Task;
}

interface FetchTasksStartAction {
	type: typeof FETCH_TASKS_START;
	payload: string[]; // An array of projectIds
}

interface FetchTasksSuccessAction {
	type: typeof FETCH_TASKS_SUCCESS;
	payload: Task[];
}

export type TaskActionTypes =
	| ReorderTasksAction
	| MoveTaskAction
	| CreateTaskStartAction
	| CreateTaskSuccessAction
	| FetchTasksStartAction
	| FetchTasksSuccessAction;
