import React, { useState } from 'react';
import {
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	TextField,
	Typography,
} from '@material-ui/core';
import { Add as AddIcon, Send as SendIcon, Close as CloseIcon } from '@material-ui/icons';

import axios from '../../config/axios.config';
import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import { User } from '../../redux/user/user.types';
import { Task } from '../../redux/tasks/tasks.types';

interface TeamMembersContainerProps {
	members: Partial<User>[];
	tasks: Task[];
	projectId: string;
}

const TeamMembersContainer: React.FC<TeamMembersContainerProps> = ({
	members,
	tasks,
	projectId,
}) => {
	interface NewMemberFieldState {
		email: string;
		error?: string;
		uid?: string;
	}

	// Component State
	const [showAddMemberField, setShowAddMemberField] = useState(false);
	const [showInvitationSent, setShowInvitationSent] = useState(false);
	const [newMemberEmail, setNewMemberEmail] = useState<NewMemberFieldState>({ email: '' });

	// Helper Method
	const validateEmailAddress = async (email: string) => {
		// Validates the email address first to prevent any useless requests
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (email.trim() === '') return; // Ignore empty inputs

		if (members.map((member) => member?.email).includes(email)) {
			// Set the field to an invalid state
			setNewMemberEmail({
				...newMemberEmail,
				error: 'This user is already a member of the project',
				uid: undefined,
			});
			return;
		}

		if (!re.test(email.toLowerCase())) {
			// Set the field to an invalid state
			setNewMemberEmail({ ...newMemberEmail, error: 'Invalid Email Address', uid: undefined });
			return;
		}

		const res = await axios(`api/v0/user/${email}`, { method: 'GET' });

		if (!res.data.userId) {
			setNewMemberEmail({
				...newMemberEmail,
				error: 'We could not find a user with this Email Address',
				uid: undefined,
			});
			return;
		}

		setNewMemberEmail({ ...newMemberEmail, error: undefined, uid: res.data.userId });

		const res2 = await axios(`api/v0/user/invite`, {
			method: 'PATCH',
			data: { userId: res.data.userId, projectId },
		});

		if (res2.status === 200) {
			setShowInvitationSent(true);
			setNewMemberEmail({ email: '', error: undefined, uid: undefined });
		}
	};

	return (
		<Grid container direction='column' spacing={2}>
			<Grid item>
				<Typography variant='h5'>Team Members</Typography>
				<Divider />
			</Grid>
			<Grid item>
				<Card>
					<CardContent style={{ paddingBottom: 8 }}>
						<List>
							{members.map((member) => (
								<ListItem>
									<Grid container alignItems='center' spacing={2}>
										<Grid item>
											<ColoredAvatar
												text={member!.displayName!}
												src={member!.image}
												variant='rounded'
											/>
										</Grid>
										<Grid item xs>
											<Typography variant='subtitle1'>{member!.displayName}</Typography>
											<Divider orientation='vertical' />
										</Grid>
										<Typography>
											{`Assigned ${tasks.filter((t) => t.user === member!._id!).length} task${
												tasks.filter((t) => t.user === member!._id!).length !== 1 ? 's' : ''
											}`}
										</Typography>
									</Grid>
								</ListItem>
							))}
							<ListItem>
								{showAddMemberField ? (
									<Grid container spacing={1} alignItems='center'>
										<Grid item xs>
											<TextField
												fullWidth
												placeholder='Email Address'
												variant='outlined'
												value={newMemberEmail.email}
												size='small'
												onChange={(event: React.SyntheticEvent) => {
													setNewMemberEmail({
														email: (event.target as HTMLInputElement).value,
														error: undefined,
														uid: undefined,
													});
												}}
												error={newMemberEmail.error !== undefined && newMemberEmail.email !== ''}
												helperText={
													newMemberEmail.error !== undefined && newMemberEmail.email !== ''
														? newMemberEmail.error
														: ''
												}
											/>
										</Grid>
										<Grid item>
											<IconButton
												onClick={() => {
													setShowAddMemberField(false);
													setNewMemberEmail({
														email: '',
														error: undefined,
														uid: undefined,
													});
													setShowInvitationSent(false);
												}}
											>
												<CloseIcon />
											</IconButton>
										</Grid>
										<Grid item container justify='space-between' alignItems='center'>
											<Grid item>
												<Button
													color='primary'
													variant='contained'
													onClick={() => {
														validateEmailAddress(newMemberEmail.email);
													}}
													disabled={newMemberEmail.email.trim() === ''}
													endIcon={<SendIcon />}
												>
													Send Invitation
												</Button>
											</Grid>
											{showInvitationSent ? (
												<Grid item>
													<Typography color='primary'>Invitation Successfully Sent!</Typography>
												</Grid>
											) : null}
										</Grid>
									</Grid>
								) : (
									<Grid container justify='center'>
										<Button
											color='primary'
											variant='contained'
											size='medium'
											onClick={() => setShowAddMemberField(true)}
											endIcon={<AddIcon />}
										>
											Add a New Member
										</Button>
									</Grid>
								)}
							</ListItem>
						</List>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default TeamMembersContainer;
