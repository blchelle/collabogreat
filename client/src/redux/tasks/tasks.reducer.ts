import { Task, TaskActionTypes, REORDER_TASKS, MOVE_TASK } from './tasks.types';
import { reorderTasks, moveTasks } from './tasks.util';

const initialState: Task[] = [
	{
		_id: 'a',
		title: 'Task 1',
		order: 0,
		project: '5fe23d63e31dce327b686459',
		user: '5fe23d28e31dce327b686458',
		status: 'Not Started',
	},
	{
		_id: 'b',
		title: 'Task 2',
		order: 1,
		project: '5fe23d63e31dce327b686459',
		user: '5fe23d28e31dce327b686458',
		status: 'Not Started',
	},
	{
		_id: 'c',
		title: 'Task 3',
		order: 2,
		project: '5fe23d63e31dce327b686459',
		user: '5fe23d28e31dce327b686458',
		status: 'Not Started',
	},
	{
		_id: 'd',
		title: 'Task 4',
		order: 3,
		project: '5fe23d63e31dce327b686459',
		user: '5fe23d28e31dce327b686458',
		status: 'Not Started',
	},
	{
		_id: 'e',
		title: 'Task 5',
		order: 0,
		project: '5fe23d63e31dce327b686459',
		user: '5fe23d28e31dce327b686458',
		status: 'Done',
	},
	{
		_id: 'f',
		title: 'Task 6',
		order: 1,
		project: '5fe23d63e31dce327b686459',
		user: '5fe23d28e31dce327b686458',
		status: 'Done',
	},
];

export function taskReducer(state = initialState, action: TaskActionTypes): Task[] {
	switch (action.type) {
		case REORDER_TASKS:
			return reorderTasks(state, action.payload.task, action.payload.oldOrder);
		case MOVE_TASK:
			const { taskId, projectId, oldIndex, newIndex, oldStatus, newStatus } = action.payload;
			return moveTasks(state, taskId, projectId, oldIndex, oldStatus, newIndex, newStatus);
		default:
			return state;
	}
}
