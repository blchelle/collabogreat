import { all, call, put, takeLatest } from 'redux-saga/effects';

import axios from '../../config/axios.config';
import { extractMessageFromAPIError } from '../../util/helpers.util';
import { createProjectSuccess, setAllProjects } from '../project/project.actions';
import { Project } from '../project/project.types';
import { stopLoading } from '../loading/loading.actions';
import {
	acceptInviteSuccess,
	dismissTaskSuccess,
	leaveProjectSuccess,
	rejectInviteSuccess,
	setCurrentUser,
} from './user.actions';
import {
	AcceptInviteStartAction,
	ACCEPT_INVITE_START,
	DismissTaskStartAction,
	DISMISS_TASK_START,
	FETCH_CURRENT_USER,
	LeaveProjectStartAction,
	LEAVE_PROJECT_START,
	LOGOUT_START,
	RejectInviteStartAction,
	REJECT_INVITE_START,
} from './user.types';
import { closeModal } from '../modals/modals.actions';
import { ModalNames } from '../modals/modals.reducer';
import { fetchTasksSuccess } from '../tasks/tasks.actions';
import { openError } from '../error/error.actions';

function* getUserInformation() {
	try {
		// Attempts to fetch an authenticated users information
		const res = yield axios('user/me', { method: 'GET' });

		// Throws if the fetch was unsuccessful
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
		yield put(setCurrentUser(null));
		yield put(setAllProjects([]));
		yield put(fetchTasksSuccess([]));
	}
}

function* attemptLogout() {
	try {
		// Attempts to logout
		const res = yield axios('auth/logout', {
			method: 'GET',
		});

		// Throws if the logout was unsuccessful
		if (res.status !== 200 || !res.data.success) {
			yield put(
				openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
			);
			return;
		}

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(setCurrentUser(null));
		yield put(setAllProjects([]));
		yield put(fetchTasksSuccess([]));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}
}

function* attemptLeaveProject({ payload: { projectId } }: LeaveProjectStartAction) {
	try {
		// Calls the api route to leave a project
		const res = yield axios(`user/me/leave/${projectId}`, { method: 'PATCH' });

		if (res.status !== 200) {
			yield put(
				openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
			);
			return;
		}

		// Calls the success handlers
		yield put(leaveProjectSuccess(projectId));
		window.location.assign('/dashboard');
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
	yield put(closeModal(ModalNames.CONFIRM_DIALOG));
}

function* attemptAcceptInvite({ payload: { acceptedInviteId } }: AcceptInviteStartAction) {
	try {
		const res = yield axios(`user/me/accept/${acceptedInviteId}`, { method: 'PATCH' });
		const { project } = res.data;

		// Updates the user and project locally
		yield put(acceptInviteSuccess(acceptedInviteId));
		yield put(createProjectSuccess(project));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
}

function* attemptRejectInvite({ payload: { inviteId } }: RejectInviteStartAction) {
	try {
		// Performs an api call to update the user
		yield axios(`user/me/reject/${inviteId}`, { method: 'PATCH' });

		// Updates the user and project locally
		yield put(rejectInviteSuccess(inviteId));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
}

function* attemptDismissTask({ payload: { taskId } }: DismissTaskStartAction) {
	try {
		// Performs an api call to update the user
		yield axios(`user/me/dismiss/${taskId}`, { method: 'PATCH' });

		// Updates the user and project locally
		yield put(dismissTaskSuccess(taskId));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
}

function* onFetchCurrentUser() {
	yield takeLatest(FETCH_CURRENT_USER, getUserInformation);
}

function* onLogoutStart() {
	yield takeLatest(LOGOUT_START, attemptLogout);
}

function* onLeaveProjectStart() {
	yield takeLatest(LEAVE_PROJECT_START, attemptLeaveProject);
}

function* onAcceptInviteStart() {
	yield takeLatest(ACCEPT_INVITE_START, attemptAcceptInvite);
}

function* onRejectInviteStart() {
	yield takeLatest(REJECT_INVITE_START, attemptRejectInvite);
}

function* onDismissTaskStart() {
	yield takeLatest(DISMISS_TASK_START, attemptDismissTask);
}

export function* userSagas() {
	yield all([
		call(onFetchCurrentUser),
		call(onLogoutStart),
		call(onLeaveProjectStart),
		call(onAcceptInviteStart),
		call(onRejectInviteStart),
		call(onDismissTaskStart),
	]);
}
