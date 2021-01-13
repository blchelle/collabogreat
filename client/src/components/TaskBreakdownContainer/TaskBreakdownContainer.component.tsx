import React from 'react';
import { useHistory } from 'react-router';
import {
	Button,
	Card,
	Divider,
	Grid,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';

import { Task } from '../../redux/tasks/tasks.types';

interface TaskBreakdownContainerProps {
	tasks: Task[];
	board: string[];
	projectId: string;
}

const TaskBreakdownContainer: React.FC<TaskBreakdownContainerProps> = ({
	tasks,
	board,
	projectId,
}) => {
	const theme = useTheme();

	// React Router
	const history = useHistory();

	// Helpers
	const getColor = (index: number) => {
		switch (index) {
			case 0:
				return theme.palette.primary.main;
			case 1:
				return theme.palette.secondary.main;
			case 2:
				return theme.palette.warning.main;
			case 3:
				return theme.palette.error.main;
			case 4:
				return theme.palette.primary.light;
			case 5:
				return theme.palette.secondary.light;
			case 6:
				return theme.palette.warning.light;
			case 7:
				return theme.palette.error.light;
			case 8:
				return theme.palette.primary.dark;
			case 9:
				return theme.palette.secondary.dark;
			case 10:
				return theme.palette.warning.dark;
			case 11:
				return theme.palette.error.dark;

			default:
				return theme.palette.grey[300];
		}
	};

	// MUI Media Query
	const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Grid container spacing={4}>
			<Grid item xs>
				<Typography variant='h5'>Task Breakdown</Typography>
				<Divider />
			</Grid>
			<Grid
				item
				container
				justify='flex-start'
				spacing={2}
				direction={isScreenSmall ? 'column' : 'row'}
			>
				{board.map((stage, index) => (
					<Grid
						item
						container
						spacing={2}
						style={{ width: 'auto' }}
						alignItems='center'
						key={stage}
					>
						<Grid item>
							<Card
								elevation={0}
								style={{
									backgroundColor: getColor(index),
									width: theme.spacing(3),
									height: theme.spacing(3),
								}}
							/>
						</Grid>
						<Grid item>
							<Typography>
								{`${stage} - ${tasks.filter((t) => t.status === stage).length}`}
							</Typography>
						</Grid>
					</Grid>
				))}
			</Grid>
			<Grid item container>
				<Card
					style={{
						width: '100%',
						height: 30,
						borderRadius: 15,
						backgroundColor: '#AAA',
						display: 'flex',
						overflow: 'hidden',
					}}
				>
					{board.map((stage, index) => (
						<Tooltip title={stage} key={stage}>
							<div
								style={{
									width: `${
										100 * (tasks.filter((t) => t.status === stage).length / tasks.length)
									}%`,
									height: '100%',
									backgroundColor: getColor(index),
								}}
							/>
						</Tooltip>
					))}
				</Card>
			</Grid>
			<Grid item container justify='center'>
				<Button
					variant='contained'
					color='primary'
					onClick={() => history.push(`/projects/${projectId}/board`)}
				>
					See project board
				</Button>
			</Grid>
		</Grid>
	);
};

export default TaskBreakdownContainer;
