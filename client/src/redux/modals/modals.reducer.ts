import { ModalActionTypes, OPEN_MODAL, CLOSE_MODAL, PopperPropsExtra } from './modals.types';
import { setModalOpen } from './modals.utils';

export enum ModalNames {
	CONFIRM_DIALOG = 'CONFIRM_DIALOG',
	CREATE_PROJECT_DIALOG = 'CREATE_PROJECT_DIALOG',
	CREATE_TASK_DIALOG = 'CREATE_TASK_DIALOG',
	RENAME_STAGE_DIALOG = 'RENAME_STAGE_DIALOG',
	BOARD_STAGE_MENU_DROPDOWN = 'BOARD_STAGE_MENU_DROPDOWN',
	TASK_MENU_DROPDOWN = 'TASK_MENU_DROPDOWN',
	CREATE_DROPDOWN = 'CREATE_DROPDOWN',
	USER_DROPDOWN = 'USER_DROPDOWN',
	SEARCH_DROPDOWN = 'SEARCH_DROPDOWN',
	NOTIFICATIONS_DROPDOWN = 'NOTIFICATIONS_DROPDOWN',
}

export type ModalState = { [key in ModalNames]: PopperPropsExtra };

const initialModalState: PopperPropsExtra = {
	open: false,
	placement: undefined,
	anchorEl: null,
	children: null,
};

const initialState: ModalState = {
	CONFIRM_DIALOG: initialModalState,
	CREATE_PROJECT_DIALOG: initialModalState,
	CREATE_TASK_DIALOG: initialModalState,
	RENAME_STAGE_DIALOG: initialModalState,
	BOARD_STAGE_MENU_DROPDOWN: initialModalState,
	TASK_MENU_DROPDOWN: initialModalState,
	CREATE_DROPDOWN: initialModalState,
	USER_DROPDOWN: initialModalState,
	SEARCH_DROPDOWN: initialModalState,
	NOTIFICATIONS_DROPDOWN: initialModalState,
};

export function modalReducer(state = initialState, action: ModalActionTypes): ModalState {
	switch (action.type) {
		case OPEN_MODAL:
			return setModalOpen(state, action.payload.modalName, {
				...action.payload.modalState,
				extra: action.payload.modalState.extra,
			});
		case CLOSE_MODAL:
			return { ...state, [action.payload]: { ...state[action.payload], open: false } };
		default:
			return state;
	}
}
