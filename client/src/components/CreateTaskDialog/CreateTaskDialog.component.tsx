import React, { useState, SetStateAction, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Avatar,
	Button,
	Card,
	CircularProgress,
	Dialog,
	DialogContent,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
	useMediaQuery,
} from '@material-ui/core';

import { ReactComponent as UDNewTask } from '../../assets/insert-task.undraw.svg';
import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import { closeModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import { Task, TaskColor } from '../../redux/tasks/tasks.types';
import useStyles from './CreateTaskDialog.mui';
import theme from '../../theme';
import { createTaskStart } from '../../redux/tasks/tasks.actions';

interface FormInputState {
	visited: boolean;
	value: string;
}

interface CreateTaskDialogExtras {
	initialProjectId: string;
	initialStatus: string;
}

const CreateTaskDialog: React.FC = () => {
	// MUI Styles
	const classes = useStyles();

	// Redux
	const dispatch = useDispatch();
	const userProjects = useSelector((state: RootState) => state.projects);
	const { open, extra } = useSelector((state: RootState) => state.modals.CREATE_TASK_DIALOG);

	const initialProjectId = (extra as CreateTaskDialogExtras)?.initialProjectId;
	const initialStatus = (extra as CreateTaskDialogExtras)?.initialStatus;

	// Form State
	const initialInputState: FormInputState = { visited: false, value: '' };

	const [projectId, setProjectId] = useState<FormInputState>(initialInputState);
	const [status, setStatus] = useState<FormInputState>(initialInputState);
	const [title, setTitle] = useState<FormInputState>(initialInputState);
	const [assignee, setAssignee] = useState<FormInputState>(initialInputState);
	const [description, setDescription] = useState<FormInputState>(initialInputState);
	const [color, setColor] = useState<FormInputState>({ visited: false, value: TaskColor.GREY });
	const [isWaiting, setIsWaiting] = useState<boolean>(false);

	// Clears the inputs when the dialog opens/closes
	useEffect(() => {
		setProjectId({ visited: false, value: initialProjectId ?? '' });
		setStatus({ visited: false, value: initialStatus ?? '' });
		setTitle({ visited: false, value: '' });
		setAssignee({ visited: false, value: '' });
		setDescription({ visited: false, value: '' });
		setColor({ visited: false, value: TaskColor.GREY });
	}, [open, initialStatus, initialProjectId]);

	// Form Handlers
	const onInputChange = (setterFn: React.Dispatch<SetStateAction<FormInputState>>) => (
		event: SyntheticEvent
	) => {
		setterFn({ visited: true, value: (event.target as HTMLInputElement).value });
	};

	const onSelectProjectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setProjectId({ visited: true, value: event.target.value as string });
		setStatus(initialInputState);
		setAssignee(initialInputState);
	};

	const onSelectStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setStatus({ visited: true, value: event.target.value as string });
	};

	const onSelectAssigneeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setAssignee({ visited: true, value: event.target.value as string });
	};

	const submitForm = async (event: React.FormEvent) => {
		event.preventDefault();

		const newTask: Task = {
			_id: '', // This field should be generated on the server
			order: -1, // This field should be generated on the server
			project: projectId.value,
			status: status.value,
			title: title.value,
			user: assignee.value,
			description: description.value,
			color: color.value as TaskColor,
		};

		setIsWaiting(true);
		await dispatch(createTaskStart(newTask));
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
				onClose={() => dispatch(closeModal(ModalNames.CREATE_TASK_DIALOG))}
			>
				<Grid container>
					{isScreenSmall ? null : (
						<Grid className={classes.dialogLeft} item xs={6} container justify='center'>
							<UDNewTask className={classes.dialogLeftImage} />
						</Grid>
					)}
					<Grid item xs>
						<DialogContent>
							<Grid className={classes.dialogRight} container direction='column' spacing={2}>
								<Grid item>
									<Typography variant='h5' gutterBottom>
										Let&apos;s Get to Work!
									</Typography>
								</Grid>
								<Grid item>
									<TextField
										required
										label='Title'
										variant='outlined'
										fullWidth
										error={title.value === '' && title.visited}
										value={title.value}
										onChange={onInputChange(setTitle)}
										onBlur={() => setTitle({ ...title, visited: true })}
										helperText={
											title.value === '' && title.visited
												? 'Please give your task a name'
												: 'Give the task a clear name'
										}
									/>
								</Grid>
								<Grid item>
									<FormControl
										variant='outlined'
										fullWidth
										size='small'
										required
										error={projectId.value === '' && projectId.visited}
									>
										<InputLabel id='project-label'>Project</InputLabel>
										<Select
											fullWidth
											value={projectId.value}
											labelId='project-label'
											label='Project'
											onChange={onSelectProjectChange}
											onBlur={() => setProjectId({ ...projectId, visited: true })}
										>
											{userProjects.map((project) => (
												<MenuItem value={project._id} key={project._id}>
													<Grid container alignItems='center'>
														<ColoredAvatar
															id={project._id}
															text={project.title}
															variant='rounded'
															style={{
																width: theme.spacing(4),
																height: theme.spacing(4),
																marginRight: theme.spacing(2),
															}}
														/>
														<Typography variant='subtitle1'>{project.title}</Typography>
													</Grid>
												</MenuItem>
											))}
										</Select>
										<FormHelperText>Which Project is this Task for?</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item>
									<FormControl
										variant='outlined'
										fullWidth
										required
										size='small'
										disabled={projectId.value === ''}
										error={assignee.value === '' && assignee.visited}
									>
										<InputLabel>Assignee</InputLabel>
										<Select
											fullWidth
											value={assignee.value}
											label='Assignee'
											onChange={onSelectAssigneeChange}
											onBlur={() => setStatus({ ...status, visited: true })}
										>
											{projectId.value !== ''
												? userProjects
														.filter((project) => project._id === projectId.value)[0]
														.members?.map((member) => (
															<MenuItem value={member?._id} key={member?._id}>
																<Grid container alignItems='center'>
																	<Avatar
																		variant='rounded'
																		style={{
																			width: theme.spacing(4),
																			height: theme.spacing(4),
																			marginRight: theme.spacing(2),
																		}}
																		src={member?.image}
																	/>
																	<Typography variant='subtitle1'>{member?.displayName}</Typography>
																</Grid>
															</MenuItem>
														))
												: null}
										</Select>
										<FormHelperText>Who will be working on this task?</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item>
									<FormControl
										variant='outlined'
										fullWidth
										required
										size='small'
										disabled={projectId.value === ''}
										error={projectId.value === '' && projectId.visited}
									>
										<InputLabel id='status-label'>Status</InputLabel>
										<Select
											fullWidth
											labelId='status-label'
											value={status.value}
											label='Status'
											onChange={onSelectStatusChange}
											onBlur={() => setStatus({ ...status, visited: true })}
										>
											{projectId.value !== ''
												? userProjects
														.filter((project) => project._id === projectId.value)[0]
														.board.map((stageName) => (
															<MenuItem value={stageName} key={stageName}>
																<Typography variant='subtitle1'>{stageName}</Typography>
															</MenuItem>
														))
												: null}
										</Select>
										<FormHelperText>Set the initial status of the task</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item>
									<Card>
										<Grid container>
											<Grid item xs={2}>
												<div
													style={{ backgroundColor: color.value, width: '100%', height: '100%' }}
												/>
											</Grid>
											<Grid item xs={10} container alignContent='center'>
												{Object.values(TaskColor).map((c) => (
													<Grid item xs={2} container className={classes.colorButton}>
														<Card
															elevation={0}
															style={{ backgroundColor: c }}
															className={`${classes.color} ${
																color.value === c ? classes.selectedColor : ''
															}`}
															onClick={() => setColor({ visited: true, value: c })}
														/>
													</Grid>
												))}
											</Grid>
										</Grid>
									</Card>
									<FormHelperText>Give your task a color so you can find it easily</FormHelperText>
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
										helperText='Give clear details tso the assignee knows what they need to do'
									/>
								</Grid>
								<Grid item>
									<Button
										variant='contained'
										color='primary'
										fullWidth
										disabled={title.value === '' || projectId.value === '' || status.value === ''}
										onClick={submitForm}
									>
										Create Task
									</Button>
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

export default CreateTaskDialog;
