/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties } from 'react';
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import { Avatar, Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import theme from '../../theme';
import { User } from '../../redux/user/user.types';
import useStyles from './BoardCard.mui';

interface BoardCardProps {
	taskId: string;
	taskName: string;
	taskDescription?: string;
	assignedUser?: Partial<User>;
	cardIndex: number;
}

const BoardCard: React.FC<BoardCardProps> = ({
	taskName,
	taskDescription,
	taskId,
	assignedUser,
	cardIndex,
}) => {
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

	return (
		<Draggable key={taskId} draggableId={taskId} index={cardIndex}>
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
						style={{ backgroundColor: theme.palette.secondary.main, height: theme.spacing(4) }}
					>
						<Grid item>
							<IconButton className={classes.iconButton}>
								<EditIcon className={classes.icon} />
							</IconButton>
						</Grid>
						<Grid item>
							<IconButton className={classes.iconButton}>
								<DeleteIcon className={classes.icon} />
							</IconButton>
						</Grid>
					</Grid>
					<CardContent style={{ padding: theme.spacing(1) }}>
						<Typography variant='subtitle1'>{taskName}</Typography>
						<Grid container alignItems='flex-end'>
							<Grid item xs>
								{taskDescription ? (
									<Typography variant='body2'>
										{`${taskDescription?.substr(0, 50)}${
											taskDescription?.length > 50 ? '...' : ''
										}`}
									</Typography>
								) : null}
							</Grid>
							<Grid item>
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
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)}
		</Draggable>
	);
};

export default BoardCard;
