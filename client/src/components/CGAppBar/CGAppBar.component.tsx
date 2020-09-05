import React, { ReactElement, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	AppBar,
	Avatar,
	Button,
	Grid,
	IconButton,
	InputBase,
	Link,
	Toolbar,
	useMediaQuery,
} from '@material-ui/core';
import {
	Add as AddIcon,
	Notifications as NotificationsIcon,
	Search as SearchIcon,
} from '@material-ui/icons';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.component';
import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as LogoIcon } from '../../assets/logo-icon.svg';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import useStyles from './CGAppBar.mui';
import theme from '../../theme';

const UserMenuDropdown = React.lazy(() => import('../UserMenuDropdown/UserMenuDropdown.component'));
const CreateDropdown = React.lazy(() => import('../CreateDropdown/CreateDropdown.component'));
const Dropdown = React.lazy(() => import('../Dropdown/Dropdown.component'));
const NotificationsDropdown = React.lazy(() =>
	import('../NotificationsDropdown/NotificationsDropdown.component')
);

const CGAppBar = () => {
	// MUI Classes
	const classes = useStyles();

	// Redux
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	// Handlers
	const openDropdown = (dropdownName: ModalNames, children: ReactElement) => (
		event: React.SyntheticEvent
	) => {
		dispatch(
			openModal(dropdownName, {
				open: true,
				placement: 'bottom-end',
				anchorEl: event.currentTarget as HTMLElement,
				children,
			})
		);
	};

	return (
		<>
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
								onClick={openDropdown(ModalNames.CREATE_DROPDOWN, <CreateDropdown />)}
							>
								Create
							</Button>
							<IconButton
								className={classes.notificationButton}
								onClick={openDropdown(ModalNames.NOTIFICATIONS_DROPDOWN, <NotificationsDropdown />)}
							>
								<NotificationsIcon />
							</IconButton>
							<IconButton
								onClick={openDropdown(ModalNames.USER_DROPDOWN, <UserMenuDropdown />)}
								size='small'
								disableRipple
							>
								<Avatar src={user?.image} />
							</IconButton>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Suspense fallback={<LoadingSpinner />}>
				<Dropdown modalName={ModalNames.CREATE_DROPDOWN} />
				<Dropdown modalName={ModalNames.NOTIFICATIONS_DROPDOWN} />
				<Dropdown modalName={ModalNames.USER_DROPDOWN} />
			</Suspense>
		</>
	);
};

export default CGAppBar;
