/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import {
	Avatar,
	Card,
	CardContent,
	Grid,
	IconButton,
	Tooltip,
	Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { User } from '../../redux/user/user.types';
import { deleteTaskStart } from '../../redux/tasks/tasks.actions';
import { Task } from '../../redux/tasks/tasks.types';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';

import useStyles from './BoardCard.mui';
import theme from '../../theme';

interface BoardCardProps {
	task: Task;
	assignedUser?: Partial<User>;
}

const BoardCard: React.FC<BoardCardProps> = ({ task, assignedUser }) => {
	// MUI
	const classes = useStyles();

	const getItemStyle = (
		draggableStyle: DraggingStyle | NotDraggingStyle | undefined
	): CSSProperties => ({
		// Some basic styles to make the items look a bit nicer
		userSelect: 'none',
		marginBottom: theme.spacing(1),

		// Change background colour if dragging
		background: theme.palette.background.default,

		// styles we need to apply on draggables
		...draggableStyle,
	});

	// Redux
	const dispatch = useDispatch();

	return (
		<Draggable key={task._id} draggableId={task._id} index={task.order}>
			{(provided) => (
				<Card
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={getItemStyle(provided.draggableProps.style)}
					className={classes.container}
				>
					<Grid
						container
						justify='flex-end'
						alignItems='center'
						style={{ backgroundColor: task.color, height: theme.spacing(4) }}
					>
						<Grid item>
							<IconButton
								className={classes.iconButton}
								onClick={() =>
									dispatch(
										openModal(ModalNames.CREATE_TASK_DIALOG, {
											children: null,
											open: true,
											extra: {
												id: task._id,
												initialProjectId: task.project,
												initialStatus: task.status,
												initialTitle: task.title,
												initialDescription: task.description,
												initialColor: task.color,
												initialAssignee: task.user,
												mode: 'edit',
											},
										})
									)
								}
							>
								<EditIcon className={classes.icon} />
							</IconButton>
						</Grid>
						<Grid item>
							<IconButton
								className={classes.iconButton}
								onClick={() => dispatch(deleteTaskStart(task))}
							>
								<DeleteIcon className={classes.icon} />
							</IconButton>
						</Grid>
					</Grid>
					<CardContent style={{ padding: theme.spacing(1) }}>
						<Typography variant='subtitle1'>{task.title}</Typography>
						<Grid container alignItems='flex-end'>
							<Grid item xs>
								{task.description ? (
									<Typography variant='body2'>
										{`${task.description?.substr(0, 50)}${
											task.description?.length > 50 ? '...' : ''
										}`}
									</Typography>
								) : null}
							</Grid>
							<Grid item>
								<Tooltip title={assignedUser!.displayName!} placement='right'>
									<Avatar
										style={{
											height: theme.spacing(3),
											width: theme.spacing(3),
											marginLeft: theme.spacing(1),
										}}
										src={assignedUser?.image}
									>
										{assignedUser?.displayName}
									</Avatar>
								</Tooltip>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)}
		</Draggable>
	);
};

export default BoardCard;
