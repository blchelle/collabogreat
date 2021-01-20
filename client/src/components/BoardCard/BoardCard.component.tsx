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
	useTheme,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { User } from '../../redux/user/user.types';
import { deleteTaskStart } from '../../redux/tasks/tasks.actions';
import { Task } from '../../redux/tasks/tasks.types';
import { openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';

import useStyles from './BoardCard.mui';

interface BoardCardProps {
	task: Task;
	assignedUser?: Partial<User>;
}

const BoardCard: React.FC<BoardCardProps> = ({ task, assignedUser }) => {
	// MUI
	const classes = useStyles();
	const theme = useTheme();

	const getItemStyle = (
		draggableStyle: DraggingStyle | NotDraggingStyle | undefined
	): CSSProperties => ({
		// Some basic styles to make the items look a bit nicer
		userSelect: 'none',
		marginBottom: 8,

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
						style={{ backgroundColor: task.color }}
						className={classes.cardHead}
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
								onClick={() =>
									dispatch(
										openModal(ModalNames.CONFIRM_DIALOG, {
											open: true,
											children: null,
											extra: {
												message: `Are you sure you want to delete task '${task.title}'?`,
												confirmAction: () => dispatch(deleteTaskStart(task)),
											},
										})
									)
								}
							>
								<DeleteIcon className={classes.icon} />
							</IconButton>
						</Grid>
					</Grid>
					<CardContent style={{ padding: 8 }}>
						<Typography
							variant='subtitle1'
							style={{ lineHeight: 1.1, marginBottom: theme.spacing(1) }}
						>
							{task.title}
						</Typography>
						<Grid container alignItems='flex-end'>
							<Grid item xs>
								{task.description ? (
									<Typography variant='body2'>
										{`${task.description?.substr(0, 75)}${
											task.description?.length > 75 ? '...' : ''
										}`}
									</Typography>
								) : null}
							</Grid>
							<Grid item>
								{assignedUser ? (
									<Tooltip title={assignedUser.displayName!} placement='right'>
										<Avatar className={classes.avatar} src={assignedUser.image}>
											{assignedUser.displayName}
										</Avatar>
									</Tooltip>
								) : null}
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)}
		</Draggable>
	);
};

export default BoardCard;
