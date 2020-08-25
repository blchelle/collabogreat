import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Grid } from '@material-ui/core';
import ProjectsContainer from '../../components/ProjectsContainer/ProjectsContainer.component';
import { fetchCurrentUser } from '../../redux/user/user.actions';

const Dashboard = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, []);

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
