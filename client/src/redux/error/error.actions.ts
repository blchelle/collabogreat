import { ErrorActionTypes, OPEN_ERROR, CLOSE_ERROR } from './error.types';

export function openError(description: string, solution: string): ErrorActionTypes {
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
