import React, { useState, SetStateAction, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Dialog,
	DialogContent,
	Grid,
	IconButton,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { Add as AddIcon, Close as CloseIcon } from '@material-ui/icons';

import axios from '../../config/axios.config';
import LoadingButton from '../LoadingButton/LoadingButton.component';
import { ReactComponent as UDScrumBoard } from '../../assets/scrum-board.undraw.svg';
import { closeModal } from '../../redux/modals/modals.actions';
import { Project } from '../../redux/project/project.types';
import { createProjectStart, editProjectStart } from '../../redux/project/project.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { User } from '../../redux/user/user.types';
import { RootState } from '../../redux/root.reducer';
import useStyles from './CreateProjectDialog.mui';

interface FormInputState {
	visited: boolean;
	value: string;
}

interface MemberInputState {
	email: string;
	uid?: string;
	errorReason?: string;
}

interface CreateProjectDialogExtras {
	id?: string; // Only applies in 'edit' mode
	initialTitle: string;
	initialDescription: string;
	currentMembers: Partial<User>[];
	currentBoard: string[];
	mode: 'create' | 'edit';
}

const CreateProjectDialog: React.FC = () => {
	// MUI Styles
	const classes = useStyles();
	const theme = useTheme();

	// Redux
	const dispatch = useDispatch();
	const { open, extra } = useSelector((state: RootState) => state.modals.CREATE_PROJECT_DIALOG);
	const currentUserEmail = useSelector((state: RootState) => state.user?.email);

	const id = (extra as CreateProjectDialogExtras)?.id;
	const initialTitle = (extra as CreateProjectDialogExtras)?.initialTitle;
	const initialDescription = (extra as CreateProjectDialogExtras)?.initialDescription;
	const currentBoard = (extra as CreateProjectDialogExtras)?.currentBoard;
	const currentMembers = (extra as CreateProjectDialogExtras)?.currentMembers;
	const mode = (extra as CreateProjectDialogExtras)?.mode ?? 'create';

	// Form State
	const initialInputState: FormInputState = { visited: false, value: '' };
	const [title, setTitle] = useState<FormInputState>(initialInputState);
	const [description, setDescription] = useState<FormInputState>(initialInputState);
	const [otherMembers, setOtherMembers] = useState<MemberInputState[]>([{ email: '' }]);

	// Clears the inputs when the dialog opens/closes
	useEffect(() => {
		setTitle({ visited: false, value: initialTitle ?? '' });
		setDescription({ visited: false, value: initialDescription ?? '' });
	}, [open, initialDescription, initialTitle]);

	// Form Handlers
	const onInputChange = (setterFn: React.Dispatch<SetStateAction<FormInputState>>) => (
		event: SyntheticEvent
	) => {
		setterFn({ visited: true, value: (event.target as HTMLInputElement).value });
	};

	// Queries the api to see if any user exists by the requested username
	const checkForEmail = (index: number) => async (event: React.SyntheticEvent) => {
		// Validates the email address first to prevent any useless requests
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const email = (event.target as HTMLInputElement).value.trim();
		if (email === '') return; // Ignore empty inputs

		const updatedOtherMembers = [...otherMembers];

		// Check for duplicate emails
		const emailSet = new Set<string>();
		let previousSize = 0;
		let noDuplicatesFlag = false;
		otherMembers.forEach((member, i) => {
			if (member.email.trim() === '') return;
			emailSet.add(member.email);

			if (emailSet.size !== previousSize + 1) {
				updatedOtherMembers[i].errorReason = 'Duplicate Email Address';
				updatedOtherMembers[i].uid = undefined;
				setOtherMembers(updatedOtherMembers);

				previousSize = emailSet.size;
				noDuplicatesFlag = true;
			} else {
				previousSize += 1;
			}
		});

		if (noDuplicatesFlag) return;

		// Set the field to an invalid state
		if (!re.test(email.toLowerCase())) {
			updatedOtherMembers[index].errorReason = 'Invalid Email Address';
			updatedOtherMembers[index].uid = undefined;
			setOtherMembers(updatedOtherMembers);
			return;
		}

		if (email === currentUserEmail) {
			updatedOtherMembers[index].errorReason = 'You cannot add yourself as a member to the project';
			updatedOtherMembers[index].uid = undefined;
			setOtherMembers(updatedOtherMembers);
		}

		const res = await axios(`api/v0/user/${email}`, { method: 'GET' });

		if (!res.data.userId) {
			updatedOtherMembers[index].errorReason = 'We could not find a user with this Email Address';
			updatedOtherMembers[index].uid = undefined;
			setOtherMembers(updatedOtherMembers);
			return;
		}

		updatedOtherMembers[index].errorReason = undefined;
		updatedOtherMembers[index].uid = res.data.userId;
		setOtherMembers(updatedOtherMembers);
	};

	const checkButtonDisabled = () => {
		if (title.value === '') return true;

		// In edit mode, we disable the ability to add/delete members, so return
		// false to ensure that the button is enabled
		if (mode === 'edit') return false;

		return (
			otherMembers.filter((member) => member.email === '' || (!member.errorReason && member.uid))
				.length !== otherMembers.length
		);
	};

	// Submits the users input as a response to the backend
	const submitForm = (event: React.FormEvent) => {
		event.preventDefault();

		const newProject: Project = {
			title: title.value,
			description: description.value,
			board: mode === 'edit' ? currentBoard : ['To Do', 'In Progress', 'Done'],
			members:
				mode === 'edit'
					? currentMembers
					: otherMembers
							.filter((member) => member.email.trim() !== '')
							.map((member) => {
								return { _id: member.uid };
							}),
		};

		if (mode === 'create') dispatch(createProjectStart(newProject));
		else dispatch(editProjectStart({ ...newProject, _id: id }));
	};

	// Media Queries
	const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<>
			<Dialog
				className={classes.dialog}
				fullWidth
				maxWidth={isScreenSmall ? 'xs' : 'lg'}
				open={open}
				onClose={() => dispatch(closeModal(ModalNames.CREATE_PROJECT_DIALOG))}
			>
				<Grid container>
					{isScreenSmall ? null : (
						<Grid className={classes.dialogLeft} item xs={6} container justify='center'>
							<UDScrumBoard className={classes.dialogLeftImage} />
						</Grid>
					)}
					<Grid item xs className={classes.dialogRight}>
						<DialogContent>
							<Grid container direction='column' spacing={2}>
								<Grid item>
									<Typography variant='h5' gutterBottom>
										{mode === 'edit'
											? 'Edit Project Information'
											: "Let's Build Something Amazing!"}
									</Typography>
								</Grid>
								<Grid item>
									<TextField
										required
										label='Title'
										variant='outlined'
										margin='dense'
										size='small'
										fullWidth
										error={title.value === '' && title.visited}
										value={title.value}
										onChange={onInputChange(setTitle)}
										onBlur={() => setTitle({ ...title, visited: true })}
										helperText={
											title.value === '' && title.visited
												? 'Please give your project a name'
												: 'Give your project a name that will go down in history'
										}
									/>
								</Grid>
								<Grid item>
									<TextField
										label='Description'
										variant='outlined'
										multiline
										fullWidth
										rowsMax={5}
										rows={3}
										value={description.value}
										onChange={onInputChange(setDescription)}
										onBlur={() => setDescription({ ...description, visited: true })}
										helperText="Let your team know what they'll be building"
									/>
								</Grid>
								{mode === 'create' ? (
									<Grid item container>
										<Typography variant='subtitle1'>Invite your Teammates</Typography>
										{otherMembers.map((member, index) => (
											<Grid
												container
												justify='space-between'
												alignItems='center'
												className={classes.otherMemberField}
												spacing={1}
												key={index.toString()}
											>
												<Grid item xs={11}>
													<TextField
														fullWidth
														placeholder='Email Address'
														value={member.email}
														variant='outlined'
														size='small'
														onChange={(event: React.SyntheticEvent) => {
															const updatedOtherMembers = [...otherMembers];
															updatedOtherMembers[index] = {
																...updatedOtherMembers[index],
																email: (event.target as HTMLInputElement).value,
																errorReason: undefined,
																uid: undefined,
															};
															setOtherMembers(updatedOtherMembers);
														}}
														onBlur={checkForEmail(index)}
														error={member.errorReason !== undefined && member.email !== ''}
														helperText={member.errorReason ?? ''}
													/>
												</Grid>
												{otherMembers.length > 1 ? (
													<IconButton
														size='small'
														onClick={() => {
															const updatedOtherMembers = [...otherMembers];
															updatedOtherMembers.splice(index, 1);
															setOtherMembers(updatedOtherMembers);
														}}
													>
														<CloseIcon />
													</IconButton>
												) : null}
											</Grid>
										))}
										<Grid container justify='center'>
											<Button
												color='primary'
												onClick={() => setOtherMembers([...otherMembers, { email: '' }])}
												variant='contained'
											>
												<AddIcon />
											</Button>
										</Grid>
									</Grid>
								) : null}
								<Grid item>
									<LoadingButton
										id='create project'
										variant='contained'
										color='primary'
										fullWidth
										disabled={checkButtonDisabled()}
										onClick={submitForm}
									>
										{mode === 'edit' ? 'Confirm Changes' : 'Create Project'}
									</LoadingButton>
								</Grid>
							</Grid>
						</DialogContent>
					</Grid>
				</Grid>
			</Dialog>
		</>
	);
};

export default CreateProjectDialog;
