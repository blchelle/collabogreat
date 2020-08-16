import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem } from '@material-ui/core';
import { fetchCurrentUser } from '../../redux/user/user.actions';
import { RootState } from '../../redux/root.reducer';

const Dashboard = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const projects = useSelector((state: RootState) => state.projects);

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, []);

	return (
		<div>
			<div>{user?.displayName}</div>
			<List>
				{projects.map((project) => (
					<ListItem button component='a' href={`projects/${project._id}`} key={project._id}>
						{project.title}
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default Dashboard;
