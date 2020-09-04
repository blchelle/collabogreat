import React, { useState, SetStateAction, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Dialog,
	DialogContent,
	Grid,
	TextField,
	Typography,
	useMediaQuery,
} from '@material-ui/core';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.component';
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

// TODO Add a field to the form for selecting a project image, either from a library or the users computer
// TODO Add a field for inviting new members to a project
const CreateProjectDialog: React.FC = () => {
	// MUI Styles
	const classes = useStyles();

	// Redux
	const dispatch = useDispatch();
	const { open } = useSelector((state: RootState) => state.modals.CREATE_PROJECT_DIALOG);

	// Form State
	const initialInputState: FormInputState = { visited: false, value: '' };
	const [title, setTitle] = useState<FormInputState>(initialInputState);
	const [description, setDescription] = useState<FormInputState>(initialInputState);
	const [isWaiting, setIsWaiting] = useState<Boolean>(false);

	const newProject: Project = { title: title.value, description: description.value };

	// Form Handlers
	const onInputChange = (setterFn: React.Dispatch<SetStateAction<FormInputState>>) => (
		event: SyntheticEvent
	) => {
		setterFn({ visited: true, value: (event.target as HTMLInputElement).value });
	};

	const submitForm = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsWaiting(true);
		await dispatch(createProjectStart(newProject));
		setIsWaiting(false);
		dispatch(closeModal(ModalNames.CREATE_PROJECT_DIALOG));
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
					<Grid item xs>
						<DialogContent>
							<Grid className={classes.dialogRight} container direction='column' spacing={2}>
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
								<Grid item>
									<Button
										variant='contained'
										color='primary'
										fullWidth
										disabled={title.value === ''}
										onClick={submitForm}
									>
										Create Project
									</Button>
								</Grid>
							</Grid>
						</DialogContent>
					</Grid>
				</Grid>
			</Dialog>
			{isWaiting ? <LoadingSpinner /> : null}
		</>
	);
};

export default CreateProjectDialog;
