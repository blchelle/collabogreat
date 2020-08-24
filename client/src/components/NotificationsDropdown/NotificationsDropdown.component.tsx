import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';

import { ReactComponent as NoNotifications } from '../../assets/no-notifications.svg';

const NotificationsDropdown: React.FC = () => {
	return (
		<Grid container direction='column' alignItems='center' spacing={2}>
			<Typography variant='h6' gutterBottom>
				You&apos;re all caught up!
			</Typography>
			<NoNotifications style={{ width: '40%' }} />
			<Typography variant='body1' align='center'>
				We don&apos;t have anything to notify you about yet,
				<br />
				but we&apos;ll put any notifications right here
			</Typography>
			<Grid item>
				<Button color='primary'>Edit Notification Settings</Button>
			</Grid>
		</Grid>
	);
};

export default NotificationsDropdown;
