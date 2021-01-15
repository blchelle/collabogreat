import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider, Grid, MenuItem, MenuList, Typography, useTheme } from '@material-ui/core';
import {
	ExitToApp as LogOutIcon,
	Brightness7 as LightModeIcon,
	Brightness2 as DarkModeIcon,
} from '@material-ui/icons';

import useStyles from './UserDropdown.mui';
import { logoutStart } from '../../redux/user/user.actions';
import { RootState } from '../../redux/root.reducer';
import { toggleTheme } from '../../redux/theme/theme.actions';

const UserDropdown: React.FC = () => {
	// Styles
	const classes = useStyles();
	const theme = useTheme();

	// Redux
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	return (
		<>
			<Grid className={classes.header} container spacing={2}>
				<Grid item>
					<Avatar className={classes.avatar} src={user?.image} />
				</Grid>
				<Grid item xs container direction='column' alignContent='flex-start'>
					<Typography variant='subtitle1'>{user?.displayName}</Typography>
					<Typography variant='body2'>{user?.email}</Typography>
				</Grid>
			</Grid>
			<Divider />
			<MenuList className={classes.menu}>
				<MenuItem onClick={() => dispatch(toggleTheme())}>
					{theme.palette.type === 'light' ? (
						<DarkModeIcon className={classes.marginRight} />
					) : (
						<LightModeIcon className={classes.marginRight} />
					)}
					{`Switch to ${theme.palette.type === 'light' ? 'dark' : 'light'} mode`}
				</MenuItem>
				<MenuItem onClick={() => dispatch(logoutStart())}>
					<LogOutIcon className={classes.marginRight} />
					Log Out
				</MenuItem>
			</MenuList>
		</>
	);
};

export default UserDropdown;
