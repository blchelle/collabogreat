import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import { RootState } from '../../redux/root.reducer';
import NotificationItem from '../NotificationItem/NotificationItem.component';
import { ReactComponent as NoNotifications } from '../../assets/no-notifications.svg';

const NotificationsDropdown: React.FC = () => {
	const { projectInvitations, newTasks } = useSelector((state: RootState) => state.user!);

	if (projectInvitations.length + newTasks.length === 0) {
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
			</Grid>
		);
	}

	return (
		<Grid container direction='column' spacing={2}>
			{projectInvitations.map((project) => (
				<Grid item>
					<NotificationItem _id={project._id!} type='project' title={project.title!} />
				</Grid>
			))}
			{newTasks.map((task) => (
				<Grid item>
					<NotificationItem _id={task._id!} type='task' title={task.title!} color={task.color} />
				</Grid>
			))}
		</Grid>
	);
};

export default NotificationsDropdown;
