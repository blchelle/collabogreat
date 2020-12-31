import React from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Card, CardContent, Grid, Typography } from '@material-ui/core';

import { Project } from '../../redux/project/project.types';

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	const history = useHistory();

	return (
		<Card>
			<CardContent>
				<Grid container spacing={2} alignItems='center'>
					<Grid item xs>
						<Typography variant='h5'>{project.title}</Typography>
					</Grid>
					<Grid item>
						<Avatar variant='rounded' src={project.image} style={{ width: '4rem', height: '4rem' }}>
							{project.title[0]}
						</Avatar>
					</Grid>
					<Grid item xs={12}>
						<Typography variant='body2'>{project.description}</Typography>
					</Grid>
					<Grid item>
						<Button color='primary'>Go To project</Button>
					</Grid>
					<Grid item>
						<Button color='primary' onClick={() => history.push(`projects/${project._id}/board`)}>
							Board
						</Button>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default ProjectCard;
