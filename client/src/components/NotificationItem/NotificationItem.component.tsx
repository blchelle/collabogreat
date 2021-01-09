import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';

import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import { RootState } from '../../redux/root.reducer';
import { acceptInviteStart, rejectInviteStart } from '../../redux/user/user.actions';

interface NotificationItemProps {
	_id: string;
	type: 'task' | 'project';
	title: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ _id, type, title }) => {
	console.log(type);

	// Redux
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	return (
		<Grid container spacing={2} style={{ width: 400 }}>
			<Grid item container alignItems='center' spacing={2}>
				<Grid item>
					<ColoredAvatar id={_id} text={title} />
				</Grid>
				<Grid item>
					<Typography>{`You've been invited to join ${title}`}</Typography>
				</Grid>
			</Grid>
			<Grid item container spacing={2}>
				<Grid item>
					<Button
						color='primary'
						variant='contained'
						onClick={() => {
							dispatch(acceptInviteStart(user!.projects, user!.projectInvitations, _id, user!._id));
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
		</Grid>
	);
};

export default NotificationItem;
