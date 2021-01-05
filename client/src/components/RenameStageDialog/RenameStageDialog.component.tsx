import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Dialog,
	DialogContent,
	Grid,
	IconButton,
	TextField,
	Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { RootState } from '../../redux/root.reducer';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { closeModal } from '../../redux/modals/modals.actions';
import { Project } from '../../redux/project/project.types';
import { editProjectStart } from '../../redux/project/project.actions';
import { Task } from '../../redux/tasks/tasks.types';
import { editTasksStart } from '../../redux/tasks/tasks.actions';
import theme from '../../theme';

interface RenameStageDialogProps {
	project: Project;
	stageIndex: number;
}

const RenameStageDialog: React.FC = () => {
	// Redux
	const { open, extra } = useSelector((state: RootState) => state.modals.RENAME_STAGE_DIALOG);
	const tasks = useSelector((state: RootState) => state.tasks);
	const dispatch = useDispatch();

	const project = (extra as RenameStageDialogProps)?.project;
	const stageIndex = (extra as RenameStageDialogProps)?.stageIndex;

	let filteredTasks: Task[] = [];
	if (project && stageIndex) {
		filteredTasks = tasks.filter(
			(task) => task.project === project._id && task.status === project.board[stageIndex]
		);
	}

	// State
	const [stageName, setStageName] = useState('');

	return (
		<>
			<Dialog
				fullWidth
				hideBackdrop
				open={open}
				PaperProps={{ elevation: 4 }}
				onClose={() => dispatch(closeModal(ModalNames.RENAME_STAGE_DIALOG))}
			>
				<DialogContent>
					<Grid container spacing={1}>
						<Grid item container alignItems='center' justify='space-between'>
							<Grid item>
								<Typography variant='h6'>Rename Stage</Typography>
							</Grid>
							<Grid item>
								<IconButton
									size='medium'
									onClick={() => dispatch(closeModal(ModalNames.RENAME_STAGE_DIALOG))}
								>
									<CloseIcon />
								</IconButton>
							</Grid>
						</Grid>
						<Grid
							item
							container
							xs={12}
							spacing={1}
							alignItems='center'
							style={{ marginBottom: theme.spacing(1) }}
						>
							<Grid item xs={9}>
								<TextField
									fullWidth
									size='small'
									variant='outlined'
									placeholder='New Stage Name'
									onChange={(event) =>
										setStageName((event.target as HTMLInputElement).value.trim())
									}
								/>
							</Grid>
							<Grid item xs={3}>
								<Button
									variant='contained'
									color='primary'
									disabled={stageName === ''}
									disableElevation
									onClick={() => {
										project.board[stageIndex] = stageName;
										dispatch(editProjectStart(project));

										dispatch(
											editTasksStart(
												filteredTasks.map((task) => {
													return {
														...task,
														status: stageName,
													};
												})
											)
										);
									}}
								>
									Confirm
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default RenameStageDialog;
