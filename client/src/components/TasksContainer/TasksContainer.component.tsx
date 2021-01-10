import React from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import TaskCard from '../TaskCard/TaskCard.component';
import { Task } from '../../redux/tasks/tasks.types';

interface TasksContainerProps {
	type: 'user' | 'project';
	tasks: Task[];
}

const TasksContainer: React.FC<TasksContainerProps> = ({ type, tasks }) => {
	return (
		<Grid container spacing={2}>
			<Grid item xs>
				<Typography variant='h5'>
					{`${type === 'project' ? 'Active Tasks' : 'Your Tasks'}`}
				</Typography>
				<Divider />
			</Grid>
			<Grid item container spacing={3} alignItems='stretch'>
				{tasks.map((task) => (
					<Grid item xs={12} sm={6} lg={4} key={task._id}>
						<TaskCard task={task} showAssignee={type === 'project'} />
					</Grid>
				))}
			</Grid>
		</Grid>
	);
};

export default TasksContainer;
