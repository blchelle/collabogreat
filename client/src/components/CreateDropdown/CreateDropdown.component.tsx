import React from 'react';
import { useDispatch } from 'react-redux';
import { Divider, Grid, MenuList, MenuItem, Typography } from '@material-ui/core';

import { ReactComponent as NewTaskSVG } from '../../assets/new-task.svg';
import { ReactComponent as NewProjectSVG } from '../../assets/new-project.svg';
import { ReactComponent as NewTeamSVG } from '../../assets/new-team.svg';
import { closeModal, openModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import useStyles from './CreateDropdown.mui';

const CreateDropdown: React.FC = () => {
	// MUI Styles
	const classes = useStyles();

	// Redux
	const dispatch = useDispatch();

	return (
		<MenuList>
			<MenuItem>
				<Grid container spacing={4} alignItems='center'>
					<Grid item>
						<NewTaskSVG className={classes.listItemImage} />
					</Grid>
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
			<Divider />
			<MenuItem
				onClick={() => {
					dispatch(closeModal(ModalNames.CREATE_DROPDOWN));
					dispatch(openModal(ModalNames.CREATE_PROJECT_DIALOG, { open: true, children: null }));
				}}
			>
				<Grid container spacing={4} alignItems='center'>
					<Grid item>
						<NewProjectSVG className={classes.listItemImage} />
					</Grid>
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
			<Divider />
			<MenuItem>
				<Grid container spacing={4} alignItems='center'>
					<Grid item>
						<NewTeamSVG className={classes.listItemImage} />
					</Grid>
					<Grid item xs container direction='column'>
						<Typography variant='subtitle1' gutterBottom>
							Create a New Team
						</Typography>
						<Typography variant='body2'>
							A team is a group of people who will create
							<br />
							multiple projects. Companies and Student
							<br />
							Groups are good examples of teams.
						</Typography>
					</Grid>
				</Grid>
			</MenuItem>
		</MenuList>
	);
};

export default CreateDropdown;
