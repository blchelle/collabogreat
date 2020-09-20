export const OPEN_ERROR = 'OPEN_ERROR';
export const CLOSE_ERROR = 'CLOSE_ERROR';

interface OpenErrorAction {
	type: typeof OPEN_ERROR;
	payload: { description: String; solution: String };
}

interface CloseErrorAction {
	type: typeof CLOSE_ERROR;
}

export type ErrorActionTypes = OpenErrorAction | CloseErrorAction;
