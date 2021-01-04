import React from 'react';
import { Grid, MenuItem, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import { editProjectStart } from '../../redux/project/project.actions';
import { Project } from '../../redux/project/project.types';
import { openError } from '../../redux/error/error.actions';

interface ExtraProps {
	projectId: string;
	stageName: string;
	stageIndex: number;
	numTasks: number;
}

const BoardStageMenuDropdown = () => {
	// Redux
	const dropdownState = useSelector((state: RootState) => state.modals.BOARD_STAGE_MENU_DROPDOWN);
	const extra = dropdownState.extra as ExtraProps;
	const { projectId, stageName, stageIndex, numTasks } = extra;

	const project = useSelector((state: RootState) =>
		state.projects.find((p) => p._id === projectId)
	);

	const dispatch = useDispatch();

	const deleteStage = () => {
		// Check that the stage has no tasks
		if (numTasks > 0) {
			dispatch(
				openError(
					'Unable to delete stage',
					'The stage you are trying to delete currently has ongoing tasks, try moving these tasks or deleting them first'
				)
			);
			return;
		}

		const newStages = [...project!.board];
		newStages.splice(stageIndex, 1);
		dispatch(editProjectStart({ ...project, board: newStages } as Project));
	};

	return (
		<Grid container direction='column'>
			<MenuItem
				onClick={() =>
					dispatch(
						openModal(ModalNames.CREATE_TASK_DIALOG, {
							children: null,
							open: true,
							extra: { initialProjectId: projectId, initialStatus: stageName },
						})
					)
				}
			>
				<Typography>Add Task...</Typography>
			</MenuItem>
			<MenuItem>
				<Typography>Rename Stage...</Typography>
			</MenuItem>
			<MenuItem onClick={deleteStage}>
				<Typography>Delete Stage...</Typography>
			</MenuItem>
		</Grid>
	);
};

export default BoardStageMenuDropdown;
