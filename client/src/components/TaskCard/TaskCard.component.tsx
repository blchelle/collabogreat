import { Card, CardContent, Grid, Link, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/root.reducer';
import { Task } from '../../redux/tasks/tasks.types';
import useStyles from './TaskCard.mui';

import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import theme from '../../theme';

interface TaskCardProps {
	task: Task;
	showAssignee: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, showAssignee }) => {
	// MUI
	const classes = useStyles();

	// Redux
	const project = useSelector(
		(state: RootState) => state.projects.find((proj) => proj._id === task.project)!
	);

	const assignee = project.members?.find((member) => member?._id === task.user);

	return (
		<Card className={classes.container}>
			<div
				style={{
					backgroundColor: task.color,
					height: theme.spacing(2),
				}}
			/>

			<CardContent className={classes.container}>
				<Grid container className={classes.container}>
					<Grid item xs={12}>
						<Typography variant='h6'>{task.title}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant='body1' className={classes.cardDescription}>
							{task.description}
						</Typography>
					</Grid>
					<Grid item container alignItems='center' className={classes.cardProject}>
						<Typography variant='subtitle1' style={{ marginRight: theme.spacing(1) }}>
							Project:
						</Typography>
						<Link href={`/projects/${project._id}/board`} color='primary' variant='subtitle1'>
							{project.title}
						</Link>
					</Grid>
					<Grid item>
						<Typography variant='body1' className={classes.cardStatus}>
							{`Status: ${task.status}`}
						</Typography>
					</Grid>
					{assignee && showAssignee ? (
						<Grid item container alignItems='center'>
							<ColoredAvatar
								id={assignee._id}
								src={assignee.image}
								text={assignee.displayName!}
								style={{
									marginRight: theme.spacing(2),
									height: theme.spacing(4),
									width: theme.spacing(4),
								}}
							/>
							<Link href={`/projects/${project._id}/board`} color='textPrimary' variant='subtitle1'>
								{assignee?.displayName}
							</Link>
						</Grid>
					) : null}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default TaskCard;
