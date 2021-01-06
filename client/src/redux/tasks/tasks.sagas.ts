/* eslint-disable no-restricted-syntax */
import axios from 'axios';

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { closeModal } from '../modals/modals.actions';
import { ModalNames } from '../modals/modals.reducer';
import { openError } from '../error/error.actions';
import {
	CREATE_TASK_START,
	TaskActionTypes,
	Task,
	FETCH_TASKS_START,
	EDIT_TASKS_START,
	DELETE_TASK_START,
} from './tasks.types';
import {
	createTaskSuccess,
	deleteTaskSuccess,
	editTasksSuccess,
	fetchTasksSuccess,
} from './tasks.actions';

type RequestTask = Pick<Task, Exclude<keyof Task, '_id' | 'order'>>;

axios.defaults.baseURL = 'http://localhost:8000';

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
		const res = yield axios('api/v0/tasks', {
			method: 'POST',
			data: reqTask,
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		// Throws if the action was unsuccessful
		// TODO Read the error description and solution from the response into the error message.
		if (res.status !== 201) {
			yield put(openError('Error', 'Here is a solution'));
			return;
		}

		const task = res.data.task as Task;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(createTaskSuccess(task));
		yield put(closeModal(ModalNames.CREATE_TASK_DIALOG));
	} catch (err) {
		yield put(openError('Error', 'Here is a solution'));
	}
}

function* attemptFetchTasks({ payload }: TaskActionTypes) {
	try {
		let tasks: Task[] = [];

		if (Array.isArray(payload)) {
			for (const projectId of payload) {
				const res = yield axios(`api/v0/tasks/project/${projectId}`, {
					method: 'GET',
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Credentials': true,
					},
				});

				// Throws if the action was unsuccessful
				// TODO Read the error description and solution from the response into the error message.
				if (res.status !== 200) {
					yield put(openError('Error', 'Here is a solution'));
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
		yield put(openError('Error', 'Here is a solution'));
	}
}

function* attemptModifyTasks({ payload }: TaskActionTypes) {
	try {
		// Tasks is an array of all the modified tasks
		const tasks = payload;
		yield put(editTasksSuccess(tasks as Task[]));

		if (!Array.isArray(payload)) {
			yield put(
				openError(
					'Tasks in the request must be an array',
					'This is our fault, contact brocklchelle@gmail.com to report this issue'
				)
			);
			return;
		}

		const res = yield axios(`api/v0/tasks`, {
			method: 'PATCH',
			data: {
				tasks,
			},
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		// Throws if the action was unsuccessful
		// TODO Read the error description and solution from the response into the error message.
		if (res.status !== 200) {
			yield put(openError(res.message, res.solution));
			return;
		}

		const resTasks = res.data.tasks;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(editTasksSuccess(resTasks));
	} catch (err) {
		yield put(openError('Error', 'Here is a solution'));
	}
}

function* attemptDeleteTask({ payload }: TaskActionTypes) {
	// Store the task preemptively, so that you can recover from a failed deletion
	const task = payload as Task;
	try {
		// Delete the task optimistically
		yield put(deleteTaskSuccess(task._id));

		const res = yield axios(`api/v0/tasks/${task._id}`, {
			method: 'DELETE',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		// Throws if the action was unsuccessful
		// TODO Read the error description and solution from the response into the error message.
		if (res.status !== 204) {
			// Put the task back if the deletion failed
			yield put(createTaskSuccess(task));
			yield put(openError(res.message, res.solution));
			return;
		}

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(deleteTaskSuccess(payload as string));
	} catch (err) {
		// Put the task back if the deletion failed
		yield put(createTaskSuccess(task));
		yield put(openError('Error', 'Here is a solution'));
	}
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
