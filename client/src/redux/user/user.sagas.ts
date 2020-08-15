import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { setCurrentUser } from './user.actions';
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
		yield put(setCurrentUser(res.data.user));
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
