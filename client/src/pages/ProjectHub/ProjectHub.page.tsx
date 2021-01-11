import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Breadcrumbs, Grid, Link, Typography } from '@material-ui/core';

import ColoredAvatar from '../../components/ColoredAvatar/ColoredAvatar.component';
import TasksContainer from '../../components/TasksContainer/TasksContainer.component';
import TeamMembersContainer from '../../components/TeamMembersContainer/TeamMembersContainer.component';
import { RootState } from '../../redux/root.reducer';

import useCommonStyles from '../common.mui';
import theme from '../../theme';
import TaskBreakdownContainer from '../../components/TaskBreakdownContainer/TaskBreakdownContainer.component';

const ProjectHub = () => {
	// Hooks
	const { id } = useParams<{ id: string }>();

	// Redux
	const project = useSelector((state: RootState) => state.projects.find((p) => p._id === id)!);
	const tasks = useSelector((state: RootState) => state.tasks.filter((t) => t.project === id));
	const commonClasses = useCommonStyles();

	return (
		<Grid container direction='column'>
			<Grid item>
				<Breadcrumbs aria-label='breadcrumb' className={commonClasses.breadCrumb}>
					<Link color='inherit' href='/dashboard'>
						Dashboard
					</Link>
					<Typography color='textPrimary'>{project?.title}</Typography>
				</Breadcrumbs>
			</Grid>
			<Grid
				item
				container
				style={{
					paddingLeft: theme.spacing(10),
					paddingRight: theme.spacing(10),
					marginTop: theme.spacing(1),
					marginBottom: theme.spacing(1),
				}}
				spacing={10}
			>
				<Grid item container direction='column' xs={8} spacing={4}>
					<Grid item container spacing={2} alignItems='center'>
						<Grid item>
							<ColoredAvatar
								src={project.image}
								text={project.title}
								id={id}
								variant='rounded'
								style={{ width: theme.spacing(6), height: theme.spacing(6), fontSize: 20 }}
							/>
						</Grid>
						<Grid item>
							<Typography variant='h4'>{project.title}</Typography>
						</Grid>
					</Grid>
					<Grid item container>
						<TaskBreakdownContainer tasks={tasks} board={project.board} projectId={id} />
					</Grid>
					<Grid item>
						<TasksContainer type='project' tasks={tasks} />
					</Grid>
				</Grid>
				<Grid item xs>
					<TeamMembersContainer members={project.members!} tasks={tasks} projectId={id} />
				</Grid>
			</Grid>
		</Grid>
	);
};

export default ProjectHub;
