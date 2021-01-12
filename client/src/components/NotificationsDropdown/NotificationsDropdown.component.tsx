import React from 'react';
import { useSelector } from 'react-redux';
import { Divider, Grid, Typography } from '@material-ui/core';

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
			{projectInvitations.map((project, index) => (
				<>
					<Grid item>
						<NotificationItem _id={project._id!} type='project' title={project.title!} />
					</Grid>
					{index !== projectInvitations.length - 1 || newTasks.length !== 0 ? <Divider /> : null}
				</>
			))}
			{newTasks.map((task, index) => (
				<Grid item>
					<NotificationItem _id={task._id!} type='task' title={task.title!} color={task.color} />
					{index !== newTasks.length - 1 ? <Divider /> : null}
				</Grid>
			))}
		</Grid>
	);
};

export default NotificationsDropdown;
