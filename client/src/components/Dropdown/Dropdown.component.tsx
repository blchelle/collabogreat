import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClickAwayListener, Grow, Paper, Popper } from '@material-ui/core';

import { closeModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import useStyles from './Dropdown.mui';

interface DropdownProps {
	modalName: ModalNames;
}

const Dropdown: React.FC<DropdownProps> = ({ modalName }) => {
	// MUI Styles
	const classes = useStyles();

	// Redux
	const { open, anchorEl, placement, children } = useSelector(
		(state: RootState) => state.modals[modalName]
	);
	const dispatch = useDispatch();

	const getTransformOrigin = () => {
		switch (placement) {
			case 'left-start':
				return '100% 0%';
			case 'left':
				return '100% 50%';
			case 'left-end':
				return '100% 100%';
			case 'right-start':
				return '0% 0%';
			case 'right':
				return '0% 50%';
			case 'right-end':
				return '0% 100%';
			case 'top-start':
				return '0% 100%';
			case 'top':
				return '50% 100%';
			case 'top-end':
				return '100% 100%';
			case 'bottom-start':
				return '0% 0%';
			case 'bottom':
				return '50% 0%';
			case 'bottom-end':
				return '100% 0%';
			default:
				return '0% 0%';
		}
	};

	return (
		<Popper open={open} anchorEl={anchorEl} placement={placement} transition>
			<ClickAwayListener onClickAway={() => dispatch(closeModal(modalName))}>
				<Grow in={open} style={{ transformOrigin: getTransformOrigin() }}>
					<Paper className={classes.paper}>{children}</Paper>
				</Grow>
			</ClickAwayListener>
		</Popper>
	);
};

export default Dropdown;
