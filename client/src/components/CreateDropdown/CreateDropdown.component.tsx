import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Divider,
	Grid,
	MenuList,
	MenuItem,
	Typography,
	useTheme,
	useMediaQuery,
} from '@material-ui/core';

import { ReactComponent as NewTaskSVG } from '../../assets/new-task.svg';
import { ReactComponent as NewProjectSVG } from '../../assets/new-project.svg';
import { closeModal, openModal } from '../../redux/modals/modals.actions';
import { RootState } from '../../redux/root.reducer';
import { ModalNames } from '../../redux/modals/modals.reducer';
import useStyles from './CreateDropdown.mui';

const CreateDropdown: React.FC = () => {
	// MUI Styles
	const classes = useStyles();
	const theme = useTheme();
	const screenIsSmall = useMediaQuery(theme.breakpoints.down('sm'));

	// Redux
	const dispatch = useDispatch();
	const numProjects = useSelector((state: RootState) => state.projects.length);

	return (
		<MenuList className={classes.container}>
			{numProjects > 0 ? (
				<MenuItem
					onClick={() => {
						dispatch(closeModal(ModalNames.CREATE_DROPDOWN));
						dispatch(openModal(ModalNames.CREATE_TASK_DIALOG, { open: true, children: null }));
					}}
				>
					<Grid container spacing={4} alignItems='center'>
						{screenIsSmall ? null : (
							<Grid item>
								<NewTaskSVG className={classes.listItemImage} />
							</Grid>
						)}
						<Grid item xs container direction='column'>
							<Typography variant='subtitle1' gutterBottom>
								Create a New Task
							</Typography>
							<Typography variant='body2'>
								A task is a is a bite-sized job which will
								<br />
								contribute to the completion of a project.
							</Typography>
						</Grid>
					</Grid>
				</MenuItem>
			) : null}
			{numProjects > 0 ? <Divider /> : null}
			<MenuItem
				onClick={() => {
					dispatch(closeModal(ModalNames.CREATE_DROPDOWN));
					dispatch(openModal(ModalNames.CREATE_PROJECT_DIALOG, { open: true, children: null }));
				}}
			>
				<Grid container spacing={4} alignItems='center'>
					{screenIsSmall ? null : (
						<Grid item>
							<NewProjectSVG className={classes.listItemImage} />
						</Grid>
					)}
					<Grid item xs container direction='column'>
						<Typography variant='subtitle1' gutterBottom>
							Create a New Project
						</Typography>
						<Typography variant='body2'>
							A project is a collection of tasks which contribute
							<br />
							to the completion of a a product.
						</Typography>
					</Grid>
				</Grid>
			</MenuItem>
		</MenuList>
	);
};

export default CreateDropdown;
