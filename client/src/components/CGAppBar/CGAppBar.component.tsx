import React, { ReactElement } from 'react';
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

import Dropdown from '../Dropdown/Dropdown.component';
import UserDropdown from '../UserDropdown/UserDropdown.component';
import CreateDropdown from '../CreateDropdown/CreateDropdown.component';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown.component';
import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as LogoIcon } from '../../assets/logo-icon.svg';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import useStyles from './CGAppBar.mui';
import theme from '../../theme';

const CGAppBar: React.FC = () => {
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

						<Grid
							item
							md
							xs={12}
							className={`${classes.searchBar}
								${useMediaQuery(theme.breakpoints.down('sm')) ? classes.searchBarMobile : null}`}
						>
							<SearchIcon className={classes.searchIcon} />
							<InputBase
								placeholder='Search for projects, teams, tasks'
								inputProps={{ 'aria-label': 'search' }}
								fullWidth
							/>
						</Grid>

						<Grid item>
							{useMediaQuery(theme.breakpoints.up('sm')) ? (
								<Button
									className={classes.createButton}
									endIcon={<AddIcon />}
									onClick={openDropdown(ModalNames.CREATE_DROPDOWN, <CreateDropdown />)}
									color='primary'
									variant='contained'
								>
									Create
								</Button>
							) : (
								<IconButton
									onClick={openDropdown(ModalNames.CREATE_DROPDOWN, <CreateDropdown />)}
									color='primary'
								>
									<AddIcon />
								</IconButton>
							)}
							<IconButton
								onClick={openDropdown(ModalNames.NOTIFICATIONS_DROPDOWN, <NotificationsDropdown />)}
								className={classes.notificationsButton}
							>
								<NotificationsIcon />
							</IconButton>
							<IconButton
								onClick={openDropdown(ModalNames.USER_DROPDOWN, <UserDropdown />)}
								size='small'
								disableRipple
							>
								<Avatar src={user?.image} />
							</IconButton>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Dropdown modalName={ModalNames.CREATE_DROPDOWN} />
			<Dropdown modalName={ModalNames.NOTIFICATIONS_DROPDOWN} />
			<Dropdown modalName={ModalNames.USER_DROPDOWN} />
		</>
	);
};

export default CGAppBar;
