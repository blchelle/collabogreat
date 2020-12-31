import { Task } from './tasks.types';

export const reorderTasks = (tasks: Task[], movedTask: Task, oldTaskOrder: number): Task[] => {
	return tasks.map((task) => {
		if (task.project !== movedTask.project || task.status !== movedTask.status) return task;

		if (task._id === movedTask._id) {
			return movedTask;
		}

		if (oldTaskOrder < movedTask.order) {
			if (task.order > oldTaskOrder && task.order <= movedTask.order) {
				return { ...task, order: task.order - 1 };
			}
		} else if (oldTaskOrder > movedTask.order) {
			if (task.order >= movedTask.order && task.order < oldTaskOrder)
				return { ...task, order: task.order + 1 };
		}

		return task;
	});
};

export const moveTasks = (
	tasks: Task[],
	taskId: string,
	projectId: string,
	oldIndex: number,
	oldStatus: string,
	newIndex: number,
	newStatus: string
) => {
	return tasks.map((task) => {
		// Don't change tasks in a different project
		if (task.project !== projectId) return task;

		// Don't change tasks in the same project but different stages
		if (task.status !== newStatus && task.status !== oldStatus) return task;

		// Sets the new status and index if the tasks id is the same as the one being changed
		if (task._id === taskId) return { ...task, status: newStatus, order: newIndex };

		if (task.status === oldStatus) {
			// Decrements the index of all tasks in the moved tasks old status that were listed
			// after the moved task
			if (task.order > oldIndex) return { ...task, order: task.order - 1 };
		} else if (task.status === newStatus) {
			// Increments the index of all tasks in the moved tasks new status that are now
			// after the moved task
			if (task.order >= newIndex) return { ...task, order: task.order + 1 };
		}

		// Catches any tasks that were in the new tasks new column or old column, but occur
		// before the moved tasks new index
		return task;
	});
};
