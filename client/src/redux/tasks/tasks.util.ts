import { Task } from './tasks.types';

export const reorderTasks = (tasks: Task[], movedTask: Task, oldTaskOrder: number): Task[] => {
	return tasks.map((task) => {
		if (task.project !== movedTask.project || task.status !== movedTask.status) return task;

		if (task._id === movedTask._id) {
			return movedTask;
		} else {
			if (oldTaskOrder < movedTask.order) {
				if (task.order > oldTaskOrder && task.order <= movedTask.order) {
					return { ...task, order: task.order - 1 };
				}
			} else if (oldTaskOrder > movedTask.order) {
				if (task.order >= movedTask.order && task.order < oldTaskOrder)
					return { ...task, order: task.order + 1 };
			}

			return task;
		}
	});
};
