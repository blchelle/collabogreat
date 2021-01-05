import React from 'react';

import { Breadcrumbs, Container, Grid, Link } from '@material-ui/core';
import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';
import TasksContainer from '../../components/TasksContainer/TasksContainer.component';
import theme from '../../theme';

const Dashboard: React.FC = () => {
	return (
		<>
			<Breadcrumbs aria-label='breadcrumb' style={{ marginBottom: theme.spacing(2) }}>
				<Link color='inherit' href='/dashboard'>
					Dashboard
				</Link>
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
