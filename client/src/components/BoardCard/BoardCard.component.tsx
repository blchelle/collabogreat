/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties } from 'react';
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import { Card, CardContent } from '@material-ui/core';

import theme from '../../theme';

interface BoardCardProps {
	taskName: string;
	taskId: string;
	cardIndex: number;
}

const BoardCard: React.FC<BoardCardProps> = ({ taskName, taskId, cardIndex }) => {
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
				>
					<div
						style={{ backgroundColor: theme.palette.secondary.main, height: theme.spacing(3) }}
					/>
					<CardContent>{taskName}</CardContent>
				</Card>
			)}
		</Draggable>
	);
};

export default BoardCard;
