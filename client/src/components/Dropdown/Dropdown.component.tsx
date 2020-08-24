import React from 'react';
import { ClickAwayListener, Grow, Paper, Popper, PopperProps } from '@material-ui/core';

import useStyles from './Dropdown.mui';

interface DropdownProps extends PopperProps {
	closeDropdown: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
	anchorEl,
	children,
	open,
	placement,
	closeDropdown,
}) => {
	// MUI Styles
	const classes = useStyles();

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
			<ClickAwayListener onClickAway={closeDropdown}>
				<Grow in={open} style={{ transformOrigin: getTransformOrigin() }}>
					<Paper className={classes.paper}>{children}</Paper>
				</Grow>
			</ClickAwayListener>
		</Popper>
	);
};

export default Dropdown;
