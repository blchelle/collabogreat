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

export type TaskActionTypes = ReorderTasksAction | MoveTaskAction;
