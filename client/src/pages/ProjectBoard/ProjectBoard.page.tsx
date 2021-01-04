/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Breadcrumbs, Button, Grid, Link } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import useStyles from './ProjectBoard.mui';
import AddStageForm from '../../components/AddStageForm/AddStageForm.component';
import BoardStage from '../../components/BoardStage/BoardStage.component';
import { RootState } from '../../redux/root.reducer';
import { editTasksStart } from '../../redux/tasks/tasks.actions';
import { reorderTasks, moveTasks } from '../../redux/tasks/tasks.util';
import { editProject } from '../../redux/project/project.actions';
import { Project } from '../../redux/project/project.types';
import theme from '../../theme';

const ProjectBoard: React.FC = () => {
	const classes = useStyles();

	// ProjectBoard State
	const [showAddStageForm, setShowAddStageForm] = useState(false);

	// Gets the project Id from the route
	const projectId = useParams<{ id: string }>().id;

	// Redux Things
	const tasks = useSelector((state: RootState) =>
		state.tasks.filter((task) => task.project === projectId)
	);

	const project = useSelector(
		(state: RootState) => state.projects.find((project) => project._id === projectId)!
	);

	const stageNames = project!.board;

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

		if (result.type === 'CARD') {
			const movedTask = tasks.filter(
				({ status, order }) => status === stageNames[+source.droppableId] && order === source.index
			)[0];

			if (source.droppableId === destination.droppableId) {
				movedTask.order = destination.index;
				dispatch(editTasksStart(reorderTasks(tasks, movedTask, source.index)));
			} else {
				dispatch(
					editTasksStart(
						moveTasks(
							tasks,
							movedTask._id,
							projectId,
							source.index,
							stageNames[+source.droppableId],
							destination.index,
							stageNames[+destination.droppableId]
						)
					)
				);
			}
		} else {
			const temp = stageNames[source.index];

			// Removes the element from the array
			stageNames.splice(source.index, 1);

			// Adds the element back to the array at the new index
			stageNames.splice(destination.index, 0, temp);

			dispatch(editProject({ ...project, board: stageNames } as Project));
		}
	};

	return (
		<>
			<Breadcrumbs aria-label='breadcrumb' style={{ marginBottom: theme.spacing(2) }}>
				<Link color='inherit' href='/dashboard'>
					Dashboard
				</Link>
				<Link color='inherit' href='/dashboard'>
					{project.title}
				</Link>
				<Link color='textPrimary' href={`/${project._id}/board`} aria-current='page'>
					Board
				</Link>
			</Breadcrumbs>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='board' type='STAGES' direction='horizontal'>
					{(provided) => (
						<Grid
							ref={provided.innerRef}
							container
							wrap='nowrap'
							style={{ overflowX: 'auto', paddingBottom: theme.spacing(1) }}
						>
							{Object.entries(stages).map(([droppableId, { name, items }]) => {
								return (
									<Grid item key={droppableId}>
										<BoardStage
											project={project}
											stageId={droppableId}
											stageName={name}
											tasks={items}
										/>
									</Grid>
								);
							})}
							{provided.placeholder}
							<Grid item>
								{showAddStageForm ? (
									<AddStageForm closeClickHandler={setShowAddStageForm} project={project} />
								) : (
									<Button
										disableElevation
										variant='contained'
										className={classes.addStageButton}
										startIcon={<AddIcon />}
										onClick={() => setShowAddStageForm(true)}
									>
										Add Stage
									</Button>
								)}
							</Grid>
						</Grid>
					)}
				</Droppable>
			</DragDropContext>
		</>
	);
};

export default ProjectBoard;
