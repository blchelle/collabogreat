import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Card,
	CardContent,
	Divider,
	Grid,
	MenuItem,
	MenuList,
	Typography,
} from '@material-ui/core';
import {
	AddCircle as AddIcon,
	Edit as EditIcon,
	MeetingRoom as LeaveIcon,
} from '@material-ui/icons';

import { closeModal, openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { Project } from '../../redux/project/project.types';
import { leaveProjectStart } from '../../redux/user/user.actions';
import { openError } from '../../redux/error/error.actions';
import { stopLoading } from '../../redux/loading/loading.actions';

interface ProjectSettingsProps {
	project: Project;
	numUserTasks: number;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, numUserTasks }) => {
	// Redux
	const dispatch = useDispatch();

	const openNewTask = () => {
		dispatch(
			openModal(ModalNames.CREATE_TASK_DIALOG, {
				children: null,
				open: true,
				extra: {
					initialProjectId: project._id!,
				},
			})
		);
	};

	const openEditProject = () => {
		dispatch(
			openModal(ModalNames.CREATE_PROJECT_DIALOG, {
				children: null,
				open: true,
				extra: {
					id: project._id,
					initialTitle: project.title,
					initialDescription: project.description,
					currentBoard: project.board,
					currentMembers: project.members!,
					mode: 'edit',
				},
			})
		);
	};

	const leaveProject = () => {
		if (numUserTasks > 0) {
			dispatch(
				openError(
					'Unable to leave project',
					'You still have tasks assigned to you within the project, reassign or delete these tasks first'
				)
			);
			dispatch(stopLoading());
			dispatch(closeModal(ModalNames.CONFIRM_DIALOG));
			return;
		}

		dispatch(leaveProjectStart(project._id!));
	};

	return (
		<Card>
			<CardContent style={{ paddingBottom: 0 }}>
				<Grid container direction='column'>
					<Grid item>
						<Typography variant='h6'>Project Settings</Typography>
						<Divider />
					</Grid>
					<Grid item>
						<MenuList>
							<MenuItem onClick={openNewTask}>
								<Grid container spacing={2} alignItems='center'>
									<Grid item>
										<AddIcon />
									</Grid>
									<Grid item xs>
										<Typography>Add Task to Project</Typography>
									</Grid>
								</Grid>
							</MenuItem>
							<MenuItem onClick={openEditProject}>
								<Grid container spacing={2} alignItems='center'>
									<Grid item>
										<EditIcon />
									</Grid>
									<Grid item xs>
										<Typography>Edit Project Information</Typography>
									</Grid>
								</Grid>
							</MenuItem>
							<MenuItem
								onClick={() => {
									dispatch(
										openModal(ModalNames.CONFIRM_DIALOG, {
											open: true,
											children: null,
											extra: {
												confirmAction: leaveProject,
												message: `Are you sure you want to leave '${project.title}'?`,
											},
										})
									);
								}}
							>
								<Grid container spacing={2} alignItems='center'>
									<Grid item>
										<LeaveIcon />
									</Grid>
									<Grid item xs>
										<Typography>Leave Project</Typography>
									</Grid>
								</Grid>
							</MenuItem>
						</MenuList>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default ProjectSettings;
