/* eslint-disable no-restricted-syntax */
import axios from 'axios';

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { closeModal } from '../modals/modals.actions';
import { ModalNames } from '../modals/modals.reducer';
import { openError } from '../error/error.actions';
import { CREATE_TASK_START, TaskActionTypes, Task, FETCH_TASKS_START } from './tasks.types';
import { createTaskSuccess, fetchTasksSuccess } from './tasks.actions';

type RequestTask = Pick<Task, Exclude<keyof Task, '_id' | 'order'>>;

function* attemptCreateTask({ payload }: TaskActionTypes) {
	try {
		axios.defaults.baseURL = 'http://localhost:8000';

		const taskPayload = payload as Task;
		const reqTask: RequestTask = {
			project: taskPayload.project,
			status: taskPayload.status,
			title: taskPayload.title,
			user: taskPayload.user,
			description: taskPayload.description,
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
		axios.defaults.baseURL = 'http://localhost:8000';

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

				console.log(res);

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

export function* onCreateTaskStart() {
	yield takeLatest(CREATE_TASK_START, attemptCreateTask);
}

export function* onFetchTasksStart() {
	yield takeLatest(FETCH_TASKS_START, attemptFetchTasks);
}

export function* taskSagas() {
	yield all([call(onCreateTaskStart), call(onFetchTasksStart)]);
}
