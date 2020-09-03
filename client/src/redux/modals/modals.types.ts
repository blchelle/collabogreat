import { PopperProps } from '@material-ui/core';
import { ModalNames } from './modals.reducer';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

interface OpenModalAction {
	type: typeof OPEN_MODAL;
	payload: { modalName: ModalNames; modalState: PopperProps };
}

interface CloseModalAction {
	type: typeof CLOSE_MODAL;
	payload: ModalNames;
}

export type ModalActionTypes = OpenModalAction | CloseModalAction;
