import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Divider, Grid, Typography, useMediaQuery, useTheme } from '@material-ui/core';

import ProjectCard from '../ProjectCard/ProjectCard.component';
import { ReactComponent as UDNoProjects } from '../../assets/no-projects.undraw.svg';
import { Project } from '../../redux/project/project.types';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';

import useStyles from './ProjectsContainer.mui';

interface ProjectsContainerProps {
	projects: Project[];
}

const ProjectsContainer: React.FC<ProjectsContainerProps> = ({ projects }) => {
	// MUI
	const classes = useStyles();
	const theme = useTheme();
	const screenIsSmall = useMediaQuery(theme.breakpoints.down('sm'));

	// Redux Hooks
	const dispatch = useDispatch();

	return (
		<Grid container direction='column' spacing={2} alignItems='center'>
			<Grid item xs className={classes.header}>
				<Typography variant='h5' gutterBottom>
					Your Projects
				</Typography>
				<Divider />
			</Grid>
			{projects.length === 0 ? (
				<Grid item container direction='column' justify='center' alignItems='center' spacing={2}>
					<UDNoProjects
						className={screenIsSmall ? classes.noProjectsSVGMobile : classes.noProjectsSVG}
					/>
					<Grid item>
						<Typography variant='h6'>
							You don&apos;t belong to any projects yet, click the button below to create your first
							project
						</Typography>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							color='primary'
							onClick={() => {
								dispatch(
									openModal(ModalNames.CREATE_PROJECT_DIALOG, { open: true, children: null })
								);
							}}
						>
							Create Your First Project
						</Button>
					</Grid>
				</Grid>
			) : (
				<Grid item container spacing={3}>
					{projects.map((project) => (
						<Grid item xs={12} md={6} key={project._id}>
							<ProjectCard project={project} />
						</Grid>
					))}
				</Grid>
			)}
		</Grid>
	);
};
export default ProjectsContainer;
