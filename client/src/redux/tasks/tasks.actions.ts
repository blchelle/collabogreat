import { Task, TaskActionTypes, REORDER_TASKS, MOVE_TASK } from './tasks.types';

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
