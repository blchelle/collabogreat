import { PopperProps } from '@material-ui/core';

import { ModalActionTypes, OPEN_MODAL, CLOSE_MODAL } from './modals.types';
import { ModalNames } from './modals.reducer';

export function openModal(modalName: ModalNames, modalState: PopperProps): ModalActionTypes {
	return {
		type: OPEN_MODAL,
		payload: { modalName, modalState },
	};
}

export function closeModal(modalName: ModalNames): ModalActionTypes {
	return {
		type: CLOSE_MODAL,
		payload: modalName,
	};
}
