import { PopperProps } from '@material-ui/core';

import { ModalActionTypes, OPEN_MODAL, CLOSE_MODAL } from './modals.types';
import { setModalOpen } from './modals.utils';

export enum ModalNames {
	CREATE_PROJECT_DIALOG = 'CREATE_PROJECT_DIALOG',
	CREATE_DROPDOWN = 'CREATE_DROPDOWN',
	USER_DROPDOWN = 'USER_DROPDOWN',
	NOTIFICATIONS_DROPDOWN = 'NOTIFICATIONS_DROPDOWN',
}

export type ModalState = { [key in ModalNames]: PopperProps };

const initialModalState: PopperProps = {
	open: false,
	placement: undefined,
	anchorEl: null,
	children: null,
};

const initialState: ModalState = {
	CREATE_PROJECT_DIALOG: initialModalState,
	CREATE_DROPDOWN: initialModalState,
	USER_DROPDOWN: initialModalState,
	NOTIFICATIONS_DROPDOWN: initialModalState,
};

export function modalReducer(state = initialState, action: ModalActionTypes): ModalState {
	switch (action.type) {
		case OPEN_MODAL:
			return setModalOpen(state, action.payload.modalName, action.payload.modalState);
		case CLOSE_MODAL:
			return { ...state, [action.payload]: { ...state[action.payload], open: false } };
		default:
			return state;
	}
}
