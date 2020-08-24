import React from 'react';
import { useSelector } from 'react-redux';

import { Grid, Typography } from '@material-ui/core';
import ProjectCard from '../ProjectCard/ProjectCard.component';
import { RootState } from '../../redux/root.reducer';

const ProjectsContainer: React.FC = () => {
	// Redux state
	const projects = useSelector((state: RootState) => state.projects);

	return (
		<>
			<Typography variant='h5' gutterBottom>
				Your Projects
			</Typography>
			<Grid container spacing={3}>
				{projects.map((project) => (
					<Grid item xs={12} md={6} key={project._id}>
						<ProjectCard project={project} />
					</Grid>
				))}
			</Grid>
		</>
	);
};
export default ProjectsContainer;
