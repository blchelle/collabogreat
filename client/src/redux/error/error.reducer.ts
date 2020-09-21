import { ErrorActionTypes, OPEN_ERROR, CLOSE_ERROR } from './error.types';

interface ErrorState {
	open: boolean;
	description: string | null;
	solution: string | null;
}

const initialState: ErrorState = {
	open: false,
	description: null,
	solution: null,
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
			return { ...state, open: false };
		default:
			return state;
	}
}
