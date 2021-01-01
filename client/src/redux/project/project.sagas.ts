import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { addProjectToUser } from '../user/user.actions';
import { createProjectSuccess } from './project.actions';
import { closeModal } from '../modals/modals.actions';
import { ModalNames } from '../modals/modals.reducer';
import { openError } from '../error/error.actions';
import { Project, ProjectActionTypes, CREATE_PROJECT_START } from './project.types';

function* attemptCreateProject({ payload }: ProjectActionTypes) {
	try {
		axios.defaults.baseURL = 'http://localhost:8000';

		// Attempts to create a new project with the information provided
		const res = yield axios('api/v0/projects', {
			method: 'POST',
			data: payload,
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

		const project = res.data.project as Project;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		if (project._id) yield put(addProjectToUser(project._id));
		yield put(createProjectSuccess(project));
		yield put(closeModal(ModalNames.CREATE_PROJECT_DIALOG));
	} catch (err) {
		yield put(openError('Error', 'Here is a solution'));
	}
}

export function* onCreateProjectStart() {
	yield takeLatest(CREATE_PROJECT_START, attemptCreateProject);
}

export function* projectSagas() {
	yield all([call(onCreateProjectStart)]);
}
