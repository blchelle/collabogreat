/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Button, Grid } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import useStyles from './ProjectBoard.mui';
import { moveTask, reorderTasks } from '../../redux/tasks/tasks.actions';
import { RootState } from '../../redux/root.reducer';
import BoardStage from '../../components/BoardStage/BoardStage.component';

const ProjectBoard: React.FC = () => {
	const classes = useStyles();

	// Gets the project Id from the route
	const projectId = useParams<{ id: string }>().id;

	// Redux Things
	const tasks = useSelector((state: RootState) =>
		state.tasks.filter((task) => task.project === projectId)
	);

	const stageNames = useSelector((state: RootState) =>
		state.projects.filter((project) => project._id === projectId)
	)[0].board;

	const dispatch = useDispatch();

	const stages = stageNames.map((stageName) => {
		return {
			name: stageName,
			items: tasks
				.filter(({ status }) => status === stageName)
				.sort((t1, t2) => t1.order - t2.order),
		};
	});

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		const movedTask = tasks.filter(
			({ status, order }) => status === stageNames[+source.droppableId] && order === source.index
		)[0];

		if (source.droppableId === destination.droppableId) {
			dispatch(
				reorderTasks({
					task: { ...movedTask, order: destination.index },
					oldOrder: source.index,
				})
			);
		} else {
			dispatch(
				moveTask({
					taskId: movedTask._id,
					projectId,
					newIndex: destination.index,
					oldIndex: source.index,
					newStatus: stageNames[+destination.droppableId],
					oldStatus: stageNames[+source.droppableId],
				})
			);
		}
	};

	return (
		<Grid container className={classes.container} spacing={2}>
			<DragDropContext onDragEnd={onDragEnd}>
				{Object.entries(stages).map(([droppableId, { name, items }]) => {
					return (
						<Grid item key={droppableId}>
							<BoardStage
								projectId={projectId}
								stageId={droppableId}
								stageName={name}
								tasks={items}
							/>
						</Grid>
					);
				})}
				<Grid item>
					<Button
						disableElevation
						variant='contained'
						className={classes.addStageButton}
						startIcon={<AddIcon />}
					>
						Add Stage
					</Button>
				</Grid>
			</DragDropContext>
		</Grid>
	);
};

export default ProjectBoard;
