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
		<>
			<ProjectsContainer />
		</>
	);
};

export default Dashboard;
