import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/root.reducer';
import TaskCard from '../TaskCard/TaskCard.component';

const TasksContainer = () => {
	const user = useSelector((state: RootState) => state.user);
	const tasks = useSelector((state: RootState) =>
		state.tasks.filter((task) => task.user === user?._id)
	);

	return (
		<>
			<Typography variant='h5' gutterBottom>
				Your Tasks
			</Typography>
			<Grid container spacing={3} alignItems='stretch'>
				{tasks.map((task) => (
					<Grid item xs={12} sm={6} lg={4} key={task._id}>
						<TaskCard task={task} showAssignee={false} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default TasksContainer;
