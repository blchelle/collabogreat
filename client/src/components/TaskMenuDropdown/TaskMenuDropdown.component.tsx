import React from 'react';
import { Grid, MenuItem, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';
import { deleteTaskStart } from '../../redux/tasks/tasks.actions';

interface ExtraProps {
	taskId: string;
}

const TaskMenuDropdown = () => {
	// Redux
	const dropdownState = useSelector((state: RootState) => state.modals.TASK_MENU_DROPDOWN);
	const extra = dropdownState.extra as ExtraProps;
	const { taskId } = extra;

	const task = useSelector((state: RootState) => state.tasks.find((t) => t._id === taskId)!);

	const dispatch = useDispatch();

	return (
		<Grid container direction='column'>
			<MenuItem
				onClick={() =>
					dispatch(
						openModal(ModalNames.CREATE_TASK_DIALOG, {
							children: null,
							open: true,
							extra: {
								id: task._id,
								initialProjectId: task.project,
								initialStatus: task.status,
								initialTitle: task.title,
								initialDescription: task.description,
								initialColor: task.color,
								initialAssignee: task.user,
								mode: 'edit',
							},
						})
					)
				}
			>
				<Typography>Edit Task...</Typography>
			</MenuItem>
			<MenuItem
				onClick={() => {
					dispatch(
						openModal(ModalNames.CONFIRM_DIALOG, {
							open: true,
							children: null,
							extra: {
								confirmAction: () => dispatch(deleteTaskStart(task)),
								message: `Are you sure you want to delete task '${task.title}'?`,
							},
						})
					);
				}}
			>
				<Typography>Delete Task...</Typography>
			</MenuItem>
		</Grid>
	);
};

export default TaskMenuDropdown;
