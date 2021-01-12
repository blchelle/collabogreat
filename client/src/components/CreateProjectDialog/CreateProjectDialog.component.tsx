import React, { useState, SetStateAction, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	Grid,
	IconButton,
	TextField,
	Typography,
	useMediaQuery,
} from '@material-ui/core';
import { Add as AddIcon, Close as CloseIcon } from '@material-ui/icons';

import axios from '../../config/axios.config';
import LoadingButton from '../LoadingButton/LoadingButton.component';
import { ReactComponent as UDScrumBoard } from '../../assets/scrum-board.undraw.svg';
import { closeModal } from '../../redux/modals/modals.actions';
import { Project } from '../../redux/project/project.types';
import { createProjectStart } from '../../redux/project/project.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import useStyles from './CreateProjectDialog.mui';
import theme from '../../theme';

interface FormInputState {
	visited: boolean;
	value: string;
}

interface MemberInputState {
	email: string;
	uid?: string;
	errorReason?: string;
}

// TODO Add a field to the form for selecting a project image, either from a library or the users computer
const CreateProjectDialog: React.FC = () => {
	// MUI Styles
	const classes = useStyles();

	// Redux
	const dispatch = useDispatch();
	const { open } = useSelector((state: RootState) => state.modals.CREATE_PROJECT_DIALOG);
	const currentUserEmail = useSelector((state: RootState) => state.user?.email);

	// Form State
	const initialInputState: FormInputState = { visited: false, value: '' };
	const [title, setTitle] = useState<FormInputState>(initialInputState);
	const [description, setDescription] = useState<FormInputState>(initialInputState);
	const [otherMembers, setOtherMembers] = useState<MemberInputState[]>([{ email: '' }]);
	const [isWaiting, setIsWaiting] = useState<boolean>(false);

	// Clears the inputs when the dialog opens/closes
	useEffect(() => {
		setTitle({ visited: false, value: '' });
		setDescription({ visited: false, value: '' });
	}, [open]);

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

		return (
			otherMembers.filter((member) => member.email === '' || (!member.errorReason && member.uid))
				.length !== otherMembers.length
		);
	};

	// Submits the users input as a response to the backend
	const submitForm = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsWaiting(true);

		const newProject: Project = {
			title: title.value,
			description: description.value,
			board: ['To Do', 'In Progress', 'Done'],
			members: otherMembers
				.filter((member) => member.email.trim() !== '')
				.map((member) => {
					return { _id: member.uid };
				}),
		};
		await dispatch(createProjectStart(newProject));

		setIsWaiting(false);
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
										Let&apos;s Build Something Amazing!
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
								<Grid item>
									<LoadingButton
										id='create project'
										variant='contained'
										color='primary'
										fullWidth
										disabled={checkButtonDisabled()}
										onClick={submitForm}
									>
										Create Project
									</LoadingButton>
								</Grid>
							</Grid>
						</DialogContent>
					</Grid>
				</Grid>
			</Dialog>
			{isWaiting ? <CircularProgress /> : null}
		</>
	);
};

export default CreateProjectDialog;
