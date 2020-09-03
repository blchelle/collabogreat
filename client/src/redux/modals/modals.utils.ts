import { PopperProps } from '@material-ui/core';
import { ModalNames, ModalState } from './modals.reducer';

export function setModalOpen(state: ModalState, modalName: ModalNames, modalState: PopperProps) {
	// Copy the existing state into a new variable
	const newState = { ...state };

	// Open the modal specified, close all of the others
	Object.entries(newState).forEach(([name]) => {
		if (name === modalName) newState[name] = modalState;
		else newState[name as ModalNames].open = false;
	});

	return newState;
}
