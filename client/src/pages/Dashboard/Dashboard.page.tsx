import React from 'react';

import { Breadcrumbs, Container, Grid, Typography } from '@material-ui/core';
import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';
import TasksContainer from '../../components/TasksContainer/TasksContainer.component';
import useCommonStyles from '../common.mui';

const Dashboard: React.FC = () => {
	const commonClasses = useCommonStyles();

	return (
		<>
			<Breadcrumbs aria-label='breadcrumb' className={commonClasses.breadCrumb}>
				<Typography color='textPrimary'>Dashboard</Typography>
			</Breadcrumbs>
			<Container maxWidth='xl'>
				<Grid container direction='column' spacing={10}>
					<Grid item>
						<ProjectsContainer />
					</Grid>
					<Grid item>
						<TasksContainer />
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Dashboard;
