export enum TaskColor {
	BLACK = '#000000', // Black
	BLUE = '#373FBF', // Blue
	BROWN = '#8F5C38', // Brown
	CYAN = '#00FFFF', // Cyan
	GREEN = '#21BF54', // Green
	GREY = '#B3B3B3', // Grey
	NAVY = '#34495E', // Navy
	ORANGE = '#E67E22', // Orange
	PINK = '#FFC0CB', // Pink
	PURPLE = '#8E44AD', // Purple
	RED = '#E81410', // Red
	YELLOW = '#FFD11F', // Yellow
}

export interface Task {
	_id: string;
	title: string;
	description?: string;
	status: string;
	order: number;
	user?: string;
	project: string;
	color: TaskColor;
}

export const CREATE_TASK_START = 'CREATE_TASK_START';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const FETCH_TASKS_START = 'FETCH_TASKS_START';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const EDIT_TASKS_START = 'EDIT_TASKS_START';
export const EDIT_TASKS_SUCCESS = 'EDIT_TASKS_SUCCESS';
export const DELETE_TASK_START = 'DELETE_TASK_START';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';

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

export interface EditTasksStartAction {
	type: typeof EDIT_TASKS_START;
	payload: Task[];
}

interface EditTasksSuccessAction {
	type: typeof EDIT_TASKS_SUCCESS;
	payload: Task[];
}

interface DeleteTaskStartAction {
	type: typeof DELETE_TASK_START;
	payload: Task; // The id of the task
}

interface DeleteTaskSuccessAction {
	type: typeof DELETE_TASK_SUCCESS;
	payload: string; // The id of the task
}

export type TaskActionTypes =
	| CreateTaskStartAction
	| CreateTaskSuccessAction
	| FetchTasksStartAction
	| FetchTasksSuccessAction
	| EditTasksStartAction
	| EditTasksSuccessAction
	| DeleteTaskStartAction
	| DeleteTaskSuccessAction;
