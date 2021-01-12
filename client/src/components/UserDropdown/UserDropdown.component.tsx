import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider, Grid, MenuItem, MenuList, Typography } from '@material-ui/core';
import { ExitToApp as LogOutIcon } from '@material-ui/icons';

import useStyles from './UserDropdown.mui';
import { logoutStart } from '../../redux/user/user.actions';
import { RootState } from '../../redux/root.reducer';

const UserDropdown: React.FC = () => {
	// Styles
	const classes = useStyles();

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
				<MenuItem onClick={() => dispatch(logoutStart())}>
					<LogOutIcon className={classes.marginRight} />
					Log Out
				</MenuItem>
			</MenuList>
		</>
	);
};

export default UserDropdown;
