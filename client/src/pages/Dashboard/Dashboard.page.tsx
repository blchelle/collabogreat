import React from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumbs, Container, Grid, Typography } from '@material-ui/core';

import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';
import TasksContainer from '../../components/TasksContainer/TasksContainer.component';
import { RootState } from '../../redux/root.reducer';
import useCommonStyles from '../common.mui';

const Dashboard: React.FC = () => {
	const commonClasses = useCommonStyles();

	const userId = useSelector((state: RootState) => state.user!._id);
	const tasks = useSelector((state: RootState) => state.tasks.filter((t) => t.user === userId));
	const projects = useSelector((state: RootState) => state.projects);

	return (
		<>
			<Breadcrumbs aria-label='breadcrumb' className={commonClasses.breadCrumb}>
				<Typography color='textPrimary'>Dashboard</Typography>
			</Breadcrumbs>
			<Container maxWidth='xl'>
				<Grid container direction='column' spacing={6}>
					<Grid item>
						<ProjectsContainer projects={projects} />
					</Grid>
					{projects.length > 0 ? (
						<Grid item>
							<TasksContainer type='user' tasks={tasks} />
						</Grid>
					) : null}
				</Grid>
			</Container>
		</>
	);
};

export default Dashboard;
