import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	AppBar,
	Avatar,
	Button,
	Grid,
	IconButton,
	InputBase,
	Link,
	Toolbar,
	PopperProps,
	useMediaQuery,
} from '@material-ui/core';
import {
	Add as AddIcon,
	Notifications as NotificationsIcon,
	Search as SearchIcon,
} from '@material-ui/icons';

import CreateDropdown from '../CreateDropdown/CreateDropdown.component';
import Dropdown from '../Dropdown/Dropdown.component';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown.component';
import UserMenuDropdown from '../UserMenuDropdown/UserMenuDropdown.component';
import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as LogoIcon } from '../../assets/logo-icon.svg';
import { RootState } from '../../redux/root.reducer';
import useStyles from './CGAppBar.mui';
import theme from '../../theme';

export type AllDropdownStates = {
	user: PopperProps;
	notifications: PopperProps;
	create: PopperProps;
};

const CGAppBar = () => {
	// MUI Classes
	const classes = useStyles();

	const initialDropdownState: PopperProps = {
		anchorEl: null,
		open: false,
		placement: undefined,
		children: null,
	};

	const [dropdowns, setDropdowns] = useState<AllDropdownStates>({
		user: { ...initialDropdownState, children: <UserMenuDropdown /> },
		notifications: { ...initialDropdownState, children: <NotificationsDropdown /> },
		create: { ...initialDropdownState, children: <CreateDropdown /> },
	});

	const invertDropdownState = (dropdownType: keyof AllDropdownStates) => (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		// Check if the dropdown is currently opened or closed
		const { open } = dropdowns[dropdownType];

		const invertedDropdownState: PopperProps = {
			open: !open,
			anchorEl: open ? null : event.currentTarget,
			placement: open ? undefined : 'bottom-end',
			children: dropdowns[dropdownType].children,
		};

		setDropdowns({ ...dropdowns, [dropdownType]: invertedDropdownState });
	};

	const closeDropdown = (dropdownType: keyof AllDropdownStates) => {
		const closedDropdownState: PopperProps = {
			anchorEl: null,
			open: false,
			placement: undefined,
			children: dropdowns[dropdownType].children,
		};

		setDropdowns({ ...dropdowns, [dropdownType]: closedDropdownState });
	};

	// Redux
	const user = useSelector((state: RootState) => state.user);

	return (
		<AppBar className={classes.appBar} color='transparent' position='static'>
			<Toolbar className={classes.toolBar}>
				<Grid container alignItems='center' justify='space-between'>
					<Grid item>
						<Link href='/dashboard'>
							{useMediaQuery(theme.breakpoints.up('lg')) ? <LogoText /> : <LogoIcon />}
						</Link>
					</Grid>
					<Grid item lg={5} className={classes.searchBar}>
						<SearchIcon className={classes.searchIcon} />
						<InputBase
							placeholder='Search for your projects, teams, tasks'
							inputProps={{ 'aria-label': 'search' }}
							fullWidth
						/>
					</Grid>
					<Grid item alignItems='center'>
						<Button
							className={classes.createButton}
							endIcon={<AddIcon />}
							onClick={invertDropdownState('create')}
						>
							Create
						</Button>
						<Dropdown
							open={dropdowns.create.open}
							placement={dropdowns.create.placement}
							anchorEl={dropdowns.create.anchorEl}
							clickOutsideHandler={() => closeDropdown('create')}
						>
							{dropdowns.create.children}
						</Dropdown>
						<IconButton
							className={classes.notificationButton}
							onClick={invertDropdownState('notifications')}
						>
							<NotificationsIcon />
						</IconButton>
						<Dropdown
							open={dropdowns.notifications.open}
							placement={dropdowns.notifications.placement}
							anchorEl={dropdowns.notifications.anchorEl}
							clickOutsideHandler={() => closeDropdown('notifications')}
						>
							{dropdowns.notifications.children}
						</Dropdown>
						<IconButton onClick={invertDropdownState('user')} size='small' disableRipple>
							<Avatar src={user?.image} />
						</IconButton>
						<Dropdown
							open={dropdowns.user.open}
							placement={dropdowns.user.placement}
							anchorEl={dropdowns.user.anchorEl}
							clickOutsideHandler={() => closeDropdown('user')}
						>
							{dropdowns.user.children}
						</Dropdown>
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

export default CGAppBar;
