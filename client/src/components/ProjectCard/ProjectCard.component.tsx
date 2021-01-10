import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';

import { Project } from '../../redux/project/project.types';
import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import useStyles from './ProjectCard.mui';

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	// React Router
	const history = useHistory();

	// MUI
	const classes = useStyles();

	return (
		<Card className={classes.container}>
			<CardContent className={classes.container}>
				<Grid container direction='column' justify='space-between' className={classes.container}>
					<Grid item container alignItems='center'>
						<Grid item xs>
							<Typography variant='h5'>{project.title}</Typography>
						</Grid>
						<Grid item>
							<ColoredAvatar
								id={project._id}
								text={project.title}
								variant='rounded'
								src={project.image}
								style={{ width: '4rem', height: '4rem' }}
							/>
						</Grid>
					</Grid>
					<Grid item>
						<Typography variant='body1'>{project.description}</Typography>
					</Grid>
					<Grid item container className={classes.cardButtons}>
						<Grid item>
							<Button color='primary' onClick={() => history.push(`projects/${project._id}`)}>
								Go To project
							</Button>
						</Grid>
						<Grid item>
							<Button color='primary' onClick={() => history.push(`projects/${project._id}/board`)}>
								Board
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default ProjectCard;
