import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { CSSProperties, useState } from 'react';
import {
	DragDropContext,
	DraggableLocation,
	DraggingStyle,
	NotDraggingStyle,
	DropResult,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';
import useStyles from './ProjectBoard.mui';

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

	type Stages = {
		notStarted: Stage;
		inProgress: Stage;
		done: Stage;
	};

	type Stage = {
		name: string;
		items: Task[];
	};

	const getItems = (count: number, offset = 0): Task[] =>
		Array.from({ length: count }, (_, k) => k).map((k) => ({
			id: `item-${k + offset}`,
			content: `item ${k + offset}`,
		}));

	const [stages, setStages] = useState<Stages>({
		notStarted: {
			name: 'Not Started',
			items: getItems(10),
		},
		inProgress: {
			name: 'In Progress',
			items: getItems(10, 10),
		},
		done: {
			name: 'Done',
			items: getItems(5, 20),
		},
	});

	// import useStyles from '../../components/BoardStage/BoardStage.mui';
	type Task = {
		id: string;
		content: string;
	};

	// fake data generator

	// a little function to help us with reordering the result
	const reorder = (list: Task[], startIndex: number, endIndex: number) => {
		const result = [...list];
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	/**
	 * Moves an item from one list to another list.
	 */
	const move = (
		source: Stage,
		destination: Stage,
		droppableSource: DraggableLocation,
		droppableDestination: DraggableLocation
	) => {
		const sourceClone = [...source.items];
		const destClone = [...destination.items];
		const [removed] = sourceClone.splice(droppableSource.index, 1);

		destClone.splice(droppableDestination.index, 0, removed);

		const result: Stages = {
			...stages,
			[droppableSource.droppableId]: {
				...source,
				items: sourceClone,
			},
			[droppableDestination.droppableId]: {
				...destination,
				items: destClone,
			},
		};

		return result;
	};

	const getList = (id: keyof Stages) => stages[id];

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		if (source.droppableId === destination.droppableId) {
			const stage = getList(source.droppableId as keyof Stages);

			const items = reorder(stage.items, source.index, destination.index);

			const updatedSource = { ...stage, items };

			setStages({ ...stages, [source.droppableId]: updatedSource });
		} else {
			const sourceStage = getList(source.droppableId as keyof Stages);
			const destStage = getList(destination.droppableId as keyof Stages);

			const result = move(sourceStage, destStage, source, destination);

			setStages({
				notStarted: result.notStarted,
				inProgress: result.inProgress,
				done: result.done,
			});
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
												<Draggable key={item.id} draggableId={item.id} index={index}>
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
															{item.content}
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
