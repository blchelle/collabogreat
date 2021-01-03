import React from 'react';

import { Breadcrumbs, Container, Link } from '@material-ui/core';
import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';
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
				<ProjectsContainer />
			</Container>
		</>
	);
};

export default Dashboard;
