import { Project } from '../project/project.types';

export type User = {
	displayName: string;
	image: string;
	projects: Project[];
} | null;

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

interface FetchCurrentUserAction {
	type: typeof FETCH_CURRENT_USER;
}

interface SetCurrentUserAction {
	type: typeof SET_CURRENT_USER;
	payload: User;
}

export type UserActionTypes = FetchCurrentUserAction | SetCurrentUserAction;
