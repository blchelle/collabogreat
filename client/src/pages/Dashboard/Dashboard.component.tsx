import React from 'react';

import { Grid } from '@material-ui/core';
import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';

const Dashboard = () => {
	return (
		<Grid container>
			<Grid item xs={1} xl={2} />
			<Grid item xs>
				<ProjectsContainer />
			</Grid>
			<Grid item xs={1} xl={2} />
		</Grid>
	);
};

export default Dashboard;
