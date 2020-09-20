import { ErrorActionTypes, OPEN_ERROR, CLOSE_ERROR } from './error.types';

interface ErrorState {
	open: boolean;
	description: String;
	solution: String;
}

const initialState: ErrorState = {
	open: false,
	description: '',
	solution: '',
};

export function errorReducer(state = initialState, action: ErrorActionTypes): ErrorState {
	switch (action.type) {
		case OPEN_ERROR:
			return {
				open: true,
				description: action.payload.description,
				solution: action.payload.solution,
			};
		case CLOSE_ERROR:
			return { open: false, description: '', solution: '' };
		default:
			return state;
	}
}
