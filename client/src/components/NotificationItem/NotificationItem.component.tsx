import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Grid, Typography, useTheme } from '@material-ui/core';

import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import LoadingButton from '../LoadingButton/LoadingButton.component';
import { RootState } from '../../redux/root.reducer';
import {
	acceptInviteStart,
	dismissTaskStart,
	rejectInviteStart,
} from '../../redux/user/user.actions';
import { TaskColor } from '../../redux/tasks/tasks.types';

interface NotificationItemProps {
	_id: string;
	type: 'task' | 'project';
	title: string;
	color?: TaskColor;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ _id, type, title, color }) => {
	// MUI
	const theme = useTheme();

	// Redux
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	return (
		<Grid container direction='column' spacing={1} style={{ width: 400 }}>
			{type === 'project' ? (
				<>
					<Grid item xs={12} container alignItems='center' spacing={2}>
						<Grid item>
							<ColoredAvatar id={_id} text={title} />
						</Grid>
						<Grid item xs>
							<Typography>{`You've been invited to join the project '${title}'`}</Typography>
						</Grid>
					</Grid>
					<Grid item container spacing={1}>
						<Grid item>
							<LoadingButton
								id={`notification accept ${_id}`}
								color='primary'
								variant='contained'
								onClick={() => {
									dispatch(
										acceptInviteStart(user!.projects, user!.projectInvitations, _id, user!._id)
									);
								}}
							>
								Accept
							</LoadingButton>
						</Grid>
						<Grid item>
							<LoadingButton
								id={`notification reject ${_id}`}
								color='default'
								onClick={() => {
									dispatch(rejectInviteStart(_id, user!.projectInvitations));
								}}
							>
								Reject
							</LoadingButton>
						</Grid>
					</Grid>
				</>
			) : (
				<>
					<Grid item xs={12} container alignItems='center' spacing={2}>
						<Grid item>
							<Card
								style={{
									backgroundColor: color,
									height: theme.spacing(5),
									width: theme.spacing(5),
								}}
								elevation={0}
							/>
						</Grid>
						<Grid item xs>
							<Typography>{`You've been assigned to the task '${title}'`}</Typography>
						</Grid>
					</Grid>
					<Grid item>
						<LoadingButton
							id={`notification dismiss ${_id}`}
							onClick={() => dispatch(dismissTaskStart(_id, user!.newTasks))}
							color='primary'
						>
							Dismiss
						</LoadingButton>
					</Grid>
				</>
			)}
		</Grid>
	);
};

export default NotificationItem;
