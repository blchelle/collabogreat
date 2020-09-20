import { ErrorActionTypes, OPEN_ERROR, CLOSE_ERROR } from './error.types';

export function openError(description: String, solution: String): ErrorActionTypes {
	return {
		type: OPEN_ERROR,
		payload: { description, solution },
	};
}

export function closeError(): ErrorActionTypes {
	return {
		type: CLOSE_ERROR,
	};
}
