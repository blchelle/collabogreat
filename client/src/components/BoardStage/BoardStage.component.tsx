/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { Task } from '../../redux/tasks/tasks.types';
import BoardCard from '../BoardCard/BoardCard.component';
import useStyles from './BoardStage.mui';
import theme from '../../theme';

interface BoardStage {
	stageId: string;
	stageName: string;
	tasks: Task[];
}

const BoardStage: React.FC<BoardStage> = ({ stageId, stageName, tasks }) => {
	const classes = useStyles();

	const getListStyle = (isDraggingOver: boolean) => ({
		backgroundColor: isDraggingOver ? '#ddd' : theme.palette.background.paper,
		width: 270,
		paddingBottom: -1 * theme.spacing(1),
	});

	return (
		<Card className={classes.container}>
			<Grid container>
				<Typography variant='subtitle1' className={classes.stageTitle}>
					{stageName}
				</Typography>
				<Droppable droppableId={stageId}>
					{(provided, result) => (
						<CardContent ref={provided.innerRef} style={getListStyle(result.isDraggingOver)}>
							{tasks.map((item: Task, index: number) => (
								<BoardCard taskName={item.title} taskId={item._id} cardIndex={index} />
							))}
							{provided.placeholder}
						</CardContent>
					)}
				</Droppable>
				<Button
					disableElevation
					className={classes.addTaskButton}
					variant='contained'
					fullWidth
					size='small'
					startIcon={<AddIcon />}
				>
					Add Task
				</Button>
			</Grid>
		</Card>
	);
};

export default BoardStage;
