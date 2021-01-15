import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Divider, Grid, Typography, useTheme, useMediaQuery } from '@material-ui/core';

import TaskCard from '../TaskCard/TaskCard.component';
import { ReactComponent as UDNoTasks } from '../../assets/no-tasks.undraw.svg';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { Task } from '../../redux/tasks/tasks.types';

import useStyles from './TasksContainer.mui';

interface TasksContainerProps {
	type: 'user' | 'project';
	tasks: Task[];
}

const TasksContainer: React.FC<TasksContainerProps> = ({ type, tasks }) => {
	// MUI
	const classes = useStyles();
	const theme = useTheme();
	const screenIsSmall = useMediaQuery(theme.breakpoints.down('sm'));

	// Redux Hooks
	const dispatch = useDispatch();

	return (
		<Grid container spacing={2}>
			<Grid item xs>
				<Typography variant='h5'>
					{`${type === 'project' ? 'Active Tasks' : 'Your Tasks'}`}
				</Typography>
				<Divider />
			</Grid>
			{tasks.length === 0 ? (
				<Grid item container direction='column' justify='center' alignItems='center' spacing={2}>
					<UDNoTasks className={screenIsSmall ? classes.noTasksSVGMobile : classes.noTasksSVG} />
					<Grid item>
						<Typography variant='h6'>
							{type === 'user'
								? "You haven't created any tasks yet, click the button below to create your first task"
								: 'This project has no active tasks, click the button below to add one'}
						</Typography>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							color='primary'
							onClick={() =>
								dispatch(openModal(ModalNames.CREATE_TASK_DIALOG, { open: true, children: null }))
							}
						>
							{type === 'user' ? 'Create Your First Task' : 'Create a Task'}
						</Button>
					</Grid>
				</Grid>
			) : (
				<Grid item container spacing={3} alignItems='stretch'>
					{tasks.map((task) => (
						<Grid item xs={12} sm={6} lg={4} key={task._id}>
							<TaskCard task={task} showAssignee={type === 'project'} />
						</Grid>
					))}
				</Grid>
			)}
		</Grid>
	);
};

export default TasksContainer;
