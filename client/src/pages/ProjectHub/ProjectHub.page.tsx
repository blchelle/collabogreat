import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Breadcrumbs, Grid, Link, Typography, useMediaQuery } from '@material-ui/core';

import ColoredAvatar from '../../components/ColoredAvatar/ColoredAvatar.component';
import ProjectSettings from '../../components/ProjectSettings/ProjectSettings.component';
import TasksContainer from '../../components/TasksContainer/TasksContainer.component';
import TeamMembersContainer from '../../components/TeamMembersContainer/TeamMembersContainer.component';
import { RootState } from '../../redux/root.reducer';

import useCommonStyles from '../common.mui';
import theme from '../../theme';
import TaskBreakdownContainer from '../../components/TaskBreakdownContainer/TaskBreakdownContainer.component';

const ProjectHub = () => {
	// MUI
	const commonClasses = useCommonStyles();

	// Hooks
	const { id } = useParams<{ id: string }>();

	// Redux
	const project = useSelector((state: RootState) => state.projects.find((p) => p._id === id)!);
	const userId = useSelector((state: RootState) => state.user!._id);
	const tasks = useSelector((state: RootState) => state.tasks.filter((t) => t.project === id));

	// MUI Media Query
	const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Grid container direction='column' justify='center'>
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
				direction={isScreenSmall ? 'column' : 'row'}
				style={{
					paddingLeft: theme.spacing(isScreenSmall ? 4 : 10),
					paddingRight: theme.spacing(isScreenSmall ? 4 : 10),
					marginTop: theme.spacing(1),
					marginBottom: theme.spacing(1),
				}}
				spacing={isScreenSmall ? 4 : 10}
			>
				<Grid item container direction='column' xs={12} lg={8} spacing={isScreenSmall ? 0 : 4}>
					{/* Project Header */}
					<Grid
						item
						container
						spacing={2}
						style={{ marginBottom: isScreenSmall ? theme.spacing(2) : 0 }}
						alignItems='center'
					>
						<Grid item style={{ marginBottom: isScreenSmall ? theme.spacing(2) : 0 }}>
							<ColoredAvatar
								src={project.image}
								text={project.title}
								id={id}
								variant='rounded'
								style={{ width: theme.spacing(6), height: theme.spacing(6), fontSize: 20 }}
							/>
						</Grid>
						<Grid item xs>
							<Typography variant='h4'>{project.title}</Typography>
						</Grid>
					</Grid>

					{/* Tasks BreakDown */}
					<Grid item container>
						<TaskBreakdownContainer tasks={tasks} board={project.board} projectId={id} />
					</Grid>

					{/* Tasks List */}
					<Grid item>
						<TasksContainer type='project' tasks={tasks} />
					</Grid>
				</Grid>
				<Grid item xs container direction='column' spacing={6}>
					{/* Team Members */}
					<Grid item>
						<TeamMembersContainer members={project.members!} tasks={tasks} projectId={id} />
					</Grid>
					<Grid item>
						<ProjectSettings
							project={project}
							numUserTasks={tasks.filter((t) => t.user === userId).length}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default ProjectHub;
