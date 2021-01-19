import { all, call, put, takeLatest } from 'redux-saga/effects';

import axios from '../../config/axios.config';
import { addProjectToUser } from '../user/user.actions';
import { createProjectSuccess, editProjectSuccess } from './project.actions';
import { closeModal } from '../modals/modals.actions';
import { ModalNames } from '../modals/modals.reducer';
import { openError } from '../error/error.actions';
import { stopLoading } from '../loading/loading.actions';
import {
	Project,
	ProjectActionTypes,
	CREATE_PROJECT_START,
	EDIT_PROJECT_START,
} from './project.types';
import { extractMessageFromAPIError } from '../../util/helpers.util';

function* attemptCreateProject({ payload }: ProjectActionTypes) {
	try {
		if (Array.isArray(payload)) {
			yield put(
				openError(
					'Unable to create project',
					"This looks like it's our mistake, please contact brocklchelle@gmail.com and explain the issue"
				)
			);
			return;
		}

		// Attempts to create a new project with the information provided
		const res = yield axios('projects', {
			method: 'POST',
			data: { ...payload, members: payload.members!.map((member) => member!._id) },
		});

		// Throws if the action was unsuccessful
		// TODO Read the error description and solution from the response into the error message.
		if (res.status !== 201) {
			yield put(openError(res.message, res.solution));
			return;
		}

		const project = res.data.project as Project;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		if (project._id) yield put(addProjectToUser(project._id));
		yield put(createProjectSuccess(project));
		yield put(closeModal(ModalNames.CREATE_PROJECT_DIALOG));

		// Redirect the user to the page for the project
		window.location.assign(`/projects/${project._id}`);
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
}

function* attemptEditProject({ payload }: ProjectActionTypes) {
	try {
		if (Array.isArray(payload)) {
			yield put(
				openError(
					'Unexpected Error',
					'Please contact brocklchelle@gmail.com if the problem persists'
				)
			);
			return;
		}

		// Assumes the write will be successful, can be undone later
		yield put(editProjectSuccess(payload));

		// Attempts to create a new project with the information provided
		const res = yield axios('projects', {
			method: 'PATCH',
			data: { project: { ...payload, members: payload.members!.map((member) => member?._id) } },
		});

		// Throws if the action was unsuccessful
		// TODO Read the error description and solution from the response into the error message.
		if (res.status !== 200) {
			yield put(
				openError('Unknown Error', 'Contact brocklchelle@gmail.com to troubleshoot the issue')
			);
			return;
		}

		const project = res.data.project as Project;

		// The actual response is going to have all the project information embedded in it
		// User documents should only contain references to the project
		// The id will be extracted from each project
		yield put(editProjectSuccess(project));
		yield put(closeModal(ModalNames.CREATE_PROJECT_DIALOG));
	} catch (err) {
		// Pulls the error off of the error response
		const { description, solution } = extractMessageFromAPIError(err);
		yield put(openError(description, solution));
	}

	yield put(stopLoading());
	yield put(closeModal(ModalNames.CONFIRM_DIALOG));
}

function* onCreateProjectStart() {
	yield takeLatest(CREATE_PROJECT_START, attemptCreateProject);
}

function* onEditProjectStart() {
	yield takeLatest(EDIT_PROJECT_START, attemptEditProject);
}

export function* projectSagas() {
	yield all([call(onCreateProjectStart), call(onEditProjectStart)]);
}
