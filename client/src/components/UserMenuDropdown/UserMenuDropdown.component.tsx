import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Divider, Grid, MenuItem, MenuList, Typography } from '@material-ui/core';
import { Settings as SettingsIcon, ExitToApp as LogOutIcon } from '@material-ui/icons';

import useStyles from './UserMenuDropdown.mui';
import { RootState } from '../../redux/root.reducer';

const UserMenuDropdown = () => {
	// Styles
	const classes = useStyles();

	// Redux
	const user = useSelector((state: RootState) => state.user);

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
				<MenuItem className={classes.menuItem}>
					<SettingsIcon className={classes.marginRight} />
					<Typography>Settings</Typography>
				</MenuItem>
				<MenuItem className={classes.menuItem}>
					<LogOutIcon className={classes.marginRight} />
					Log Out
				</MenuItem>
			</MenuList>
		</>
	);
};

export default UserMenuDropdown;
