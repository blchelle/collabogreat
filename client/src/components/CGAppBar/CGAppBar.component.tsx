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
	PopperProps,
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
import SearchDropdown from '../SearchDropdown/SearchDropdown.component';
import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as LogoIcon } from '../../assets/logo-icon.svg';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { TaskColor } from '../../redux/tasks/tasks.types';
import { RootState } from '../../redux/root.reducer';
import useStyles from './CGAppBar.mui';
import theme from '../../theme';

export interface ProjectSearchResult {
	type: 'project';
	_id: string;
	title: string;
	image?: string;
}

export interface TaskSearchResult {
	type: 'task';
	_id: string;
	title: string;
	color: TaskColor;
}

const CGAppBar: React.FC = () => {
	// MUI Classes
	const classes = useStyles();

	// Redux
	const user = useSelector((state: RootState) => state.user);
	const searchResults = useSelector((state: RootState) => [
		...state.projects.map<ProjectSearchResult>((project) => {
			return {
				type: 'project',
				_id: project._id!,
				title: project.title,
				image: project.image,
			};
		}),
		...state.tasks.map<TaskSearchResult>((task) => {
			return {
				type: 'task',
				_id: task._id,
				title: task.title,
				color: task.color,
			};
		}),
	]);

	const dispatch = useDispatch();

	// Handlers
	const openDropdown = (
		dropdownName: ModalNames,
		children: ReactElement,
		position: PopperProps['placement'] = 'bottom-end',
		extra?: Object
	) => (event: React.SyntheticEvent) => {
		dispatch(
			openModal(dropdownName, {
				open: true,
				placement: position,
				anchorEl: event.currentTarget as HTMLElement,
				children,
				extra,
			})
		);
	};

	const search = (value: string) => {
		return searchResults.filter((result) =>
			result.title.toLowerCase().includes(value.toLowerCase())
		);
	};

	return (
		<>
			<AppBar className={classes.appBar} color='inherit' position='static'>
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
								onChange={(event: React.SyntheticEvent) => {
									const results = search((event.target as HTMLInputElement).value);
									openDropdown(
										ModalNames.SEARCH_DROPDOWN,
										<SearchDropdown />,
										'bottom-start',
										results
									)(event);
								}}
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
			<Dropdown modalName={ModalNames.SEARCH_DROPDOWN} />
		</>
	);
};

export default CGAppBar;
