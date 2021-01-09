import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';

import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import { RootState } from '../../redux/root.reducer';
import {
	acceptInviteStart,
	dismissTaskStart,
	rejectInviteStart,
} from '../../redux/user/user.actions';
import { TaskColor } from '../../redux/tasks/tasks.types';
import theme from '../../theme';

interface NotificationItemProps {
	_id: string;
	type: 'task' | 'project';
	title: string;
	color?: TaskColor;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ _id, type, title, color }) => {
	// Redux
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	return (
		<Card>
			<CardContent>
				<Grid container spacing={2} style={{ width: 400 }}>
					{type === 'project' ? (
						<>
							<Grid item container alignItems='center' spacing={2}>
								<Grid item>
									<ColoredAvatar id={_id} text={title} />
								</Grid>
								<Grid item>
									<Typography>{`You've been invited to join the project '${title}'`}</Typography>
								</Grid>
							</Grid>
							<Grid item container spacing={2}>
								<Grid item>
									<Button
										color='primary'
										variant='contained'
										onClick={() => {
											dispatch(
												acceptInviteStart(user!.projects, user!.projectInvitations, _id, user!._id)
											);
										}}
									>
										Accept
									</Button>
								</Grid>
								<Grid item>
									<Button
										color='default'
										onClick={() => {
											dispatch(rejectInviteStart(_id, user!.projectInvitations));
										}}
									>
										Reject
									</Button>
								</Grid>
							</Grid>
						</>
					) : (
						<>
							<Grid item xs={12} container alignItems='center' spacing={1}>
								<Grid item xs>
									<Card
										style={{
											backgroundColor: color,
											height: theme.spacing(4),
											width: theme.spacing(4),
										}}
										elevation={0}
									/>
								</Grid>
								<Grid item xs={10}>
									<Typography>{`You've been assigned to the task '${title}'`}</Typography>
								</Grid>
							</Grid>
							<Grid item container spacing={2}>
								<Grid item>
									<Button
										onClick={() => dispatch(dismissTaskStart(_id, user!.newTasks))}
										color='primary'
									>
										Dismiss
									</Button>
								</Grid>
							</Grid>
						</>
					)}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default NotificationItem;