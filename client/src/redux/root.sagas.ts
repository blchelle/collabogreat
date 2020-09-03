import { all, call } from 'redux-saga/effects';
import { userSagas } from './user/user.sagas';
import { projectSagas } from './project/project.sagas';

export function* rootSaga() {
	yield all([call(userSagas), call(projectSagas)]);
}
