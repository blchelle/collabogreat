/* eslint-disable no-restricted-syntax */
import { all, call, put, takeLatest } from 'redux-saga/effects';

import axios from '../../config/axios.config';
import { extractMessageFromAPIError } from '../../util/helpers.util';
import { closeModal } from '../modals/modals.actions';
import { ModalNames } from '../modals/modals.reducer';
import { openError } from '../error/error.actions';
import { stopLoading } from '../loading/loading.actions';
import {
	CREATE_TASK_START,
	TaskActionTypes,
	Task,
	FETCH_TASKS_START,
	EDIT_TASKS_START,
	DELETE_TASK_START,
	EditTasksStartAction,
} from './tasks.types';
import {
	createTaskSuccess,
	deleteTaskSuccess,
	editTasksSuccess,
	fetchTasksSuccess,
} from './tasks.actions';

type RequestTask = Pick<Task, Exclude<keyof Task, '_id' | 'order'>>;

function* attemptCreateTask({ payload }: TaskActionTypes) {
	try {
		const taskPayload = payload as Task;
		const reqTask: RequestTask = {
			project: taskPayload.project,
			status: taskPayload.status,
			title: taskPayload.title,
			user: taskPayload.user,
			description: taskPayload.description,
			color: taskPayload.color,
		};

		// Attempts to create a new project with the information provided
		const res = yield axios('tasks', {
			method: 'POST',
			data: reqTask,
		});

		// Throws if the action was unsuccessful
		if (res.status !== 201) {
			yield put(
				openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
			);
			return;
		}

		const task = res.data.task as Task;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(createTaskSuccess(task));
		yield put(closeModal(ModalNames.CREATE_TASK_DIALOG));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
}

function* attemptFetchTasks({ payload }: TaskActionTypes) {
	try {
		let tasks: Task[] = [];

		if (Array.isArray(payload)) {
			for (const projectId of payload) {
				const res = yield axios(`tasks/project/${projectId}`, { method: 'GET' });

				// Throws if the action was unsuccessful
				if (res.status !== 200) {
					yield put(
						openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
					);
					return;
				}

				tasks = [...tasks, ...res.data.tasks];
			}
		}

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(fetchTasksSuccess(tasks));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}
}

function* attemptModifyTasks({ payload }: EditTasksStartAction) {
	try {
		// Tasks is an array of all the modified tasks
		const tasks = payload;
		yield put(editTasksSuccess(tasks));

		if (!Array.isArray(payload)) {
			yield put(
				openError(
					'Tasks in the request must be an array',
					'This is our fault, contact brocklchelle@gmail.com to report this issue'
				)
			);
			return;
		}

		const res = yield axios(`tasks/project/${tasks[0].project}`, {
			method: 'PATCH',
			data: {
				tasks,
			},
		});

		// Throws if the action was unsuccessful
		if (res.status !== 200) {
			yield put(
				openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
			);
			return;
		}

		const resTasks = res.data.tasks;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(editTasksSuccess(resTasks));
		yield put(closeModal(ModalNames.CREATE_TASK_DIALOG));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
}

function* attemptDeleteTask({ payload }: TaskActionTypes) {
	// Store the task preemptively, so that you can recover from a failed deletion
	const task = payload as Task;
	try {
		const res = yield axios(`tasks/${task._id}`, { method: 'DELETE' });

		// Throws if the action was unsuccessful
		if (res.status !== 204) {
			yield put(
				openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
			);
			return;
		}

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(deleteTaskSuccess(task._id));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
	yield put(closeModal(ModalNames.CONFIRM_DIALOG));
}

function* onCreateTaskStart() {
	yield takeLatest(CREATE_TASK_START, attemptCreateTask);
}

function* onFetchTasksStart() {
	yield takeLatest(FETCH_TASKS_START, attemptFetchTasks);
}

function* onModifyTasksStart() {
	yield takeLatest(EDIT_TASKS_START, attemptModifyTasks);
}

function* onDeleteTaskStart() {
	yield takeLatest(DELETE_TASK_START, attemptDeleteTask);
}

export function* taskSagas() {
	yield all([
		call(onCreateTaskStart),
		call(onFetchTasksStart),
		call(onModifyTasksStart),
		call(onDeleteTaskStart),
	]);
}
