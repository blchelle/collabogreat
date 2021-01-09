import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { closeModal } from 'redux/modals/modals.actions';
import { ModalNames } from 'redux/modals/modals.reducer';

import { createProjectSuccess, setAllProjects } from '../project/project.actions';
import { Project } from '../project/project.types';
import { setCurrentUser } from './user.actions';
import {
	AcceptInviteStartAction,
	ACCEPT_INVITE_START,
	FETCH_CURRENT_USER,
	LOGOUT_START,
	RejectInviteStartAction,
	REJECT_INVITE_START,
} from './user.types';

axios.defaults.baseURL = 'http://localhost:8000';

function* getUserInformation() {
	try {
		// Attempts to fetch an authenticated users information
		const res = yield axios('api/v0/user/me', {
			method: 'GET',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		// Throws if the fetch was unsuccesful
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
		console.log(err);
	}
}

function* attemptLogout() {
	try {
		// Attempts to fetch an authenticated users information
		const res = yield axios('api/v0/auth/logout', {
			method: 'GET',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		// Throws if the fetch was unsuccesful
		if (res.status !== 200 || !res.data.success) throw new Error('Failed to Logout');

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(setCurrentUser(null));
		yield put(setAllProjects([]));
	} catch (err) {
		console.log(err);
	}
}

function* attemptAcceptInvite({
	payload: { projects, projectInvitations, acceptedInviteId, myId },
}: AcceptInviteStartAction) {
	try {
		// Moves the id of the project invitation to the projects array
		projects.push(acceptedInviteId);
		const updatedInvitations = projectInvitations.filter(
			(invite) => invite?._id !== acceptedInviteId
		);

		// Performs an api call to update the user
		const userRes = yield axios('api/v0/user/me', {
			method: 'PATCH',
			data: { projects, projectInvitations: updatedInvitations },
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		if (userRes.status !== 200) {
			throw new Error('Request to update user failed');
		}

		// Calls the API to get the existing project members
		const { members } = (yield axios(`api/v0/projects/${acceptedInviteId}`, {
			method: 'GET',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		})).data.project;

		// Updates the projects members
		members.push(myId);

		// Performs an api call to update the project
		const projectRes = yield axios('api/v0/projects', {
			method: 'PATCH',
			data: { project: { _id: acceptedInviteId, members } },
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		if (projectRes.status !== 200) {
			throw new Error('Request to update project failed');
		}

		// Pulls the user and project off of the requests
		const { project } = projectRes.data;
		const user = { ...userRes.data.user, projectInvitations: updatedInvitations };

		// Updates the user and project locally
		yield put(setCurrentUser(user));
		yield put(createProjectSuccess(project));
		yield put(closeModal(ModalNames.NOTIFICATIONS_DROPDOWN));
	} catch (err) {
		console.log(err);
	}
}

function* attemptRejectInvite({
	payload: { inviteId, projectInvitations },
}: RejectInviteStartAction) {
	try {
		// Deletes the id of the project invitation
		const updatedInvitations = projectInvitations.filter((invite) => invite?._id !== inviteId);

		// Performs an api call to update the user
		const userRes = yield axios('api/v0/user/me', {
			method: 'PATCH',
			data: { projectInvitations: updatedInvitations },
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		if (userRes.status !== 200) {
			throw new Error('Request to update user failed');
		}

		// Pulls the user off of the requests
		const { user } = userRes.data;

		// Updates the user and project locally
		yield put(setCurrentUser(user));
		yield put(closeModal(ModalNames.NOTIFICATIONS_DROPDOWN));
	} catch (err) {
		console.log(err);
	}
}

function* onFetchCurrentUser() {
	yield takeLatest(FETCH_CURRENT_USER, getUserInformation);
}

function* onLogoutStart() {
	yield takeLatest(LOGOUT_START, attemptLogout);
}

function* onAcceptInviteStart() {
	yield takeLatest(ACCEPT_INVITE_START, attemptAcceptInvite);
}

function* onRejectInviteStart() {
	yield takeLatest(REJECT_INVITE_START, attemptRejectInvite);
}

export function* userSagas() {
	yield all([
		call(onFetchCurrentUser),
		call(onLogoutStart),
		call(onAcceptInviteStart),
		call(onRejectInviteStart),
	]);
}
