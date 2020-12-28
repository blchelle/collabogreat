import { Task, TaskActionTypes, REORDER_TASKS } from './tasks.types';

export function reorderTasks(reorderInfo: { task: Task; oldOrder: number }): TaskActionTypes {
	return {
		type: REORDER_TASKS,
		payload: reorderInfo,
	};
}
