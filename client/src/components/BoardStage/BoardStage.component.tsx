/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Button, Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core';
import { Add as AddIcon, MoreHoriz as MoreIcon } from '@material-ui/icons';

import { Task } from '../../redux/tasks/tasks.types';
import BoardCard from '../BoardCard/BoardCard.component';
import BoardStageMenuDropdown from '../BoardStageMenuDropdown/BoardStageMenuDropdown.component';
import RenameStageDialog from '../RenameStageDialog/RenameStageDialog.component';
import Dropdown from '../Dropdown/Dropdown.component';
import useStyles from './BoardStage.mui';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { openModal } from '../../redux/modals/modals.actions';
import { Project } from '../../redux/project/project.types';
import theme from '../../theme';

interface BoardStage {
	stageId: string;
	project: Project;
	stageName: string;
	tasks: Task[];
}

const BoardStage: React.FC<BoardStage> = ({ stageId, stageName, project, tasks }) => {
	const classes = useStyles();

	// Redux
	const dispatch = useDispatch();

	const projectId = project._id;
	const projectMembers = project.members;

	const getListStyle = () => ({
		backgroundColor: theme.palette.background.paper,
		width: 270,
		paddingBottom: -1 * theme.spacing(1),
	});

	// Handlers
	const openDropdown = (dropdownName: ModalNames, children: ReactElement) => (
		event: React.SyntheticEvent
	) => {
		dispatch(
			openModal(dropdownName, {
				open: true,
				placement: 'bottom-end',
				anchorEl: event.currentTarget as HTMLElement,
				children,
				extra: {
					projectId,
					stageName,
					stageIndex: +stageId,
					numTasks: tasks.length,
					numStages: project.board.length,
				},
			})
		);
	};

	return (
		<>
			<Draggable draggableId={stageId} index={+stageId}>
				{(provided) => (
					<Card
						ref={provided.innerRef}
						className={classes.container}
						{...provided.dragHandleProps}
						{...provided.draggableProps}
					>
						<Grid container>
							<Grid item container alignItems='center' className={classes.stageHeader}>
								<Grid item xs>
									<Typography variant='subtitle1' className={classes.stageTitle}>
										{stageName}
									</Typography>
								</Grid>
								<Grid item>
									<IconButton
										size='small'
										onClick={openDropdown(
											ModalNames.BOARD_STAGE_MENU_DROPDOWN,
											<BoardStageMenuDropdown />
										)}
									>
										<MoreIcon />
									</IconButton>
								</Grid>
							</Grid>
							<Droppable droppableId={stageId} type='CARD'>
								{(provided) => (
									<CardContent ref={provided.innerRef} style={getListStyle()} key={stageId}>
										{tasks.map((item: Task, index: number) => (
											<BoardCard
												taskName={item.title}
												taskId={item._id}
												taskDescription={item.description}
												cardIndex={index}
												key={item._id}
												assignedUser={projectMembers?.find((user) => user?._id === item.user)}
											/>
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
								onClick={() =>
									dispatch(
										openModal(ModalNames.CREATE_TASK_DIALOG, {
											children: null,
											open: true,
											extra: { initialProjectId: projectId, initialStatus: stageName },
										})
									)
								}
							>
								Add Task
							</Button>
						</Grid>
					</Card>
				)}
			</Draggable>
			<Dropdown modalName={ModalNames.BOARD_STAGE_MENU_DROPDOWN} />
			<RenameStageDialog />
		</>
	);
};

export default BoardStage;
