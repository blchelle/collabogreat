import React, { CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	DragDropContext,
	// DraggableLocation,
	DraggingStyle,
	NotDraggingStyle,
	DropResult,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import useStyles from './ProjectBoard.mui';
import { moveTask, reorderTasks } from '../../redux/tasks/tasks.actions';
import { Task } from '../../redux/tasks/tasks.types';
import { RootState } from '../../redux/root.reducer';
import { useParams } from 'react-router';

const grid = 8;

const getItemStyle = (
	isDragging: boolean,
	draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): CSSProperties => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? 'lightgreen' : 'grey',

	// styles we need to apply on draggables
	...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
	background: isDraggingOver ? 'lightblue' : 'lightgrey',
	padding: grid,
	width: 250,
});

const ProjectBoard: React.FC = () => {
	const classes = useStyles();

	// Gets the project Id from the route
	const projectId = useParams<{ id: string }>().id;

	// Redux Things
	const tasks = useSelector((state: RootState) =>
		state.tasks.filter((task) => task.project === projectId)
	);

	const dispatch = useDispatch();

	// type Stages = {
	// 	notStarted: Stage;
	// 	inProgress: Stage;
	// 	done: Stage;
	// };

	// type Stage = {
	// 	name: string;
	// 	items: Task[];
	// };

	const stages = {
		notStarted: {
			name: 'Not Started',
			items: tasks
				.filter(({ status }) => status === 'notStarted')
				.sort((t1, t2) => t1.order - t2.order),
		},
		inProgress: {
			name: 'In Progress',
			items: tasks
				.filter(({ status }) => status === 'inProgress')
				.sort((t1, t2) => t1.order - t2.order),
		},
		done: {
			name: 'Done',
			items: tasks.filter(({ status }) => status === 'done').sort((t1, t2) => t1.order - t2.order),
		},
	};

	/**
	 * Moves an item from one list to another list.
	 */
	// const move = (
	// 	source: Stage,
	// 	destination: Stage,
	// 	droppableSource: DraggableLocation,
	// 	droppableDestination: DraggableLocation
	// ) => {
	// 	const sourceClone = [...source.items];
	// 	const destClone = [...destination.items];
	// 	const [removed] = sourceClone.splice(droppableSource.index, 1);

	// 	destClone.splice(droppableDestination.index, 0, removed);

	// 	const result: Stages = {
	// 		...stages,
	// 		[droppableSource.droppableId]: {
	// 			...source,
	// 			items: sourceClone,
	// 		},
	// 		[droppableDestination.droppableId]: {
	// 			...destination,
	// 			items: destClone,
	// 		},
	// 	};

	// 	return result;
	// };

	// const getList = (id: keyof Stages) => stages[id];

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		const movedTask = tasks.filter(
			({ status, order }) => status === source.droppableId && order === source.index
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
					projectId: projectId,
					newIndex: destination.index,
					oldIndex: source.index,
					newStatus: destination.droppableId,
					oldStatus: source.droppableId,
				})
			);
		}
	};

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Grid container className={classes.container} spacing={2}>
				{Object.entries(stages).map(([droppableId, { name, items }]) => {
					return (
						<Grid item>
							<Droppable droppableId={droppableId}>
								{(provided, snapshot) => (
									<Card ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
										<CardContent>
											<Typography variant='subtitle1'>{name}</Typography>

											{items.map((item: Task, index: number) => (
												<Draggable key={item._id} draggableId={item._id} index={index}>
													{(provided, snapshot) => (
														<CardContent
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={getItemStyle(
																snapshot.isDragging,
																provided.draggableProps.style
															)}
														>
															{item.title}
														</CardContent>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</CardContent>
									</Card>
								)}
							</Droppable>
						</Grid>
					);
				})}
			</Grid>
		</DragDropContext>
	);
};

// Put the things into the DOM!
export default ProjectBoard;
