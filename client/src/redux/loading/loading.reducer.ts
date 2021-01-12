import { LoadingActionTypes, START_LOADING, STOP_LOADING } from './loading.types';

export function loadingReducer(
	state = { id: '', show: false },
	action: LoadingActionTypes
): { id: string; show: boolean } {
	switch (action.type) {
		case START_LOADING:
			return { id: action.payload, show: true };
		case STOP_LOADING:
			return { id: '', show: false };
		default:
			return state;
	}
}
