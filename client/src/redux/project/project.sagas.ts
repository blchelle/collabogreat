import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { addProjectToUser } from '../user/user.actions';
import { createProjectSuccess } from './project.actions';
import { Project, ProjectActionTypes, CREATE_PROJECT_START } from './project.types';

function* attemptCreateProject({ payload }: ProjectActionTypes) {
	try {
		// Attempts to fetch an authenticated users information
		const res = yield axios('api/v0/projects', {
			method: 'POST',
			data: payload,
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		// Throws if the fetch was unsuccesful
		if (res.status !== 201) throw new Error('Failed to authenticate user');

		const project = res.data.project as Project;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		if (project._id) yield put(addProjectToUser(project._id));
		yield put(createProjectSuccess(project));
	} catch (err) {
		// TODO: Trigger an action that creates a user visible error
		console.log(err);
	}
}

export function* onCreateProjectStart() {
	yield takeLatest(CREATE_PROJECT_START, attemptCreateProject);
}

export function* projectSagas() {
	yield all([call(onCreateProjectStart)]);
}
