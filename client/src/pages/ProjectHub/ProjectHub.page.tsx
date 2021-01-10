import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import {
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	Link,
	List,
	ListItem,
	Tooltip,
	Typography,
} from '@material-ui/core';

import { RootState } from '../../redux/root.reducer';
import ColoredAvatar from '../../components/ColoredAvatar/ColoredAvatar.component';
import useCommonStyles from '../common.mui';
import theme from '../../theme';
import TasksContainer from '../../components/TasksContainer/TasksContainer.component';

const ProjectHub = () => {
	// Hooks
	const { id } = useParams<{ id: string }>();

	// React Router
	const history = useHistory();

	// Redux
	const project = useSelector((state: RootState) => state.projects.find((p) => p._id === id)!);
	const tasks = useSelector((state: RootState) => state.tasks.filter((t) => t.project === id));
	const commonClasses = useCommonStyles();

	// Helpers
	const getColor = (index: number) => {
		switch (index) {
			case 0:
				return theme.palette.primary.main;
			case 1:
				return theme.palette.secondary.main;
			case 2:
				return theme.palette.warning.main;
			case 3:
				return theme.palette.error.main;
			case 4:
				return theme.palette.primary.light;
			case 5:
				return theme.palette.secondary.light;
			case 6:
				return theme.palette.warning.light;
			case 7:
				return theme.palette.error.light;
			case 8:
				return theme.palette.primary.dark;
			case 9:
				return theme.palette.secondary.dark;
			case 10:
				return theme.palette.warning.dark;
			case 11:
				return theme.palette.error.dark;

			default:
				return theme.palette.grey[300];
		}
	};

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
					<Grid item>
						<Typography variant='h5'>Task Breakdown</Typography>
						<Divider />
					</Grid>
					<Grid item container justify='flex-start' spacing={2}>
						{project.board.map((stage, index) => (
							<>
								<Grid item container spacing={2} style={{ width: 'auto' }} alignItems='center'>
									<Grid item>
										<Card
											elevation={0}
											style={{
												backgroundColor: getColor(index),
												width: theme.spacing(3),
												height: theme.spacing(3),
											}}
										/>
									</Grid>
									<Grid item>
										<Typography>
											{`${stage} - ${tasks.filter((t) => t.status === stage).length}`}
										</Typography>
									</Grid>
								</Grid>
								{index !== project.board.length - 1 ? <Divider orientation='vertical' /> : null}
							</>
						))}
					</Grid>
					<Grid item container>
						<Card
							style={{
								width: '100%',
								height: 30,
								borderRadius: 15,
								backgroundColor: '#AAA',
								display: 'flex',
								overflow: 'hidden',
							}}
						>
							{project.board.map((stage, index) => (
								<Tooltip title={stage}>
									<div
										style={{
											width: `${
												100 * (tasks.filter((t) => t.status === stage).length / tasks.length)
											}%`,
											height: '100%',
											backgroundColor: getColor(index),
										}}
									/>
								</Tooltip>
							))}
						</Card>
					</Grid>
					<Grid item container justify='center'>
						<Button
							variant='contained'
							color='primary'
							onClick={() => history.push(`/projects/${id}/board`)}
						>
							See project board
						</Button>
					</Grid>
					<Grid item>
						<TasksContainer type='project' tasks={tasks} />
					</Grid>
				</Grid>
				<Grid item xs>
					<Typography variant='h5'>Team Members</Typography>
					<Divider style={{ marginBottom: theme.spacing(1) }} />
					<Card>
						<CardContent>
							<List>
								{project.members!.map((member) => (
									<ListItem>
										<Grid container alignItems='center' spacing={2}>
											<Grid item>
												<ColoredAvatar
													text={member!.displayName!}
													src={member!.image}
													variant='rounded'
												/>
											</Grid>
											<Grid item xs>
												<Typography variant='subtitle1'>{member!.displayName}</Typography>
											</Grid>
											<Typography>
												{`Assigned ${tasks.filter((t) => t.user === member!._id!).length} tasks`}
											</Typography>
										</Grid>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default ProjectHub;
