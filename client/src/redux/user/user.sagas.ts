import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Project } from '../project/project.types';
import { setCurrentUser } from './user.actions';
import { setAllProjects } from '../project/project.actions';
import { FETCH_CURRENT_USER } from './user.types';

export function* getUserInformation() {
	try {
		const res = yield axios('api/v0/user/me', {
			method: 'GET',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		if (res.status !== 200) throw new Error('Failed to authenticate user');

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		const { projects } = res.data.user;
		yield put(setAllProjects(projects));

		const user = {
			...res.data.user,
			projects: projects.map((project: Project) => project._id),
		};

		yield put(setCurrentUser(user));
	} catch (err) {
		// TODO: Trigger an action that creates a user visible error
		console.log(err);
	}
}

export function* onFetchCurrentUser() {
	yield takeLatest(FETCH_CURRENT_USER, getUserInformation);
}

export function* userSagas() {
	yield all([call(onFetchCurrentUser)]);
}
