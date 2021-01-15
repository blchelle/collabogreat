import { LoadingActionTypes, START_LOADING, STOP_LOADING } from './loading.types';

export function startLoading(id: string): LoadingActionTypes {
	return {
		type: START_LOADING,
		payload: id,
	};
}

export function stopLoading(): LoadingActionTypes {
	return {
		type: STOP_LOADING,
	};
}
