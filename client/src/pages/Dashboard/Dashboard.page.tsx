import React from 'react';

import { Container } from '@material-ui/core';
import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';

const Dashboard: React.FC = () => {
	return (
		<Container maxWidth='xl'>
			<ProjectsContainer />
		</Container>
	);
};

export default Dashboard;