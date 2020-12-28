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

interface ReorderTasksAction {
	type: typeof REORDER_TASKS;
	payload: {
		task: Task;
		oldOrder: number;
	};
}

export type TaskActionTypes = ReorderTasksAction;
