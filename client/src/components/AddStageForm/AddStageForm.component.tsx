import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Grid, IconButton, TextField } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';

import LoadingButton from '../LoadingButton/LoadingButton.component';
import { editProjectStart } from '../../redux/project/project.actions';
import { Project } from '../../redux/project/project.types';
import useStyles from './AddStageForm.mui';

interface AddStageFormProps {
	closeClickHandler: (isOpen: boolean) => void;
	project: Project;
}

const AddStageForm: React.FC<AddStageFormProps> = ({ closeClickHandler, project }) => {
	// MUI
	const classes = useStyles();

	// Redux
	const dispatch = useDispatch();

	// State
	const [newStageName, setNewStageName] = useState('');

	return (
		<Card className={classes.addStageForm}>
			<Grid container direction='column' alignItems='center'>
				<Grid item>
					<TextField
						fullWidth
						size='small'
						variant='outlined'
						placeholder='Stage Name'
						onChange={(event: React.SyntheticEvent) =>
							setNewStageName((event.target as HTMLInputElement).value)
						}
					/>
				</Grid>
				<Grid item container alignItems='center'>
					<Grid item>
						<LoadingButton
							id='add stage'
							color='primary'
							variant='contained'
							disableElevation
							disabled={newStageName.trim() === ''}
							onClick={() => {
								closeClickHandler(false);
								dispatch(
									editProjectStart({
										...project,
										board: [...project.board, newStageName],
									} as Project)
								);
							}}
						>
							Confirm
						</LoadingButton>
					</Grid>
					<Grid item>
						<IconButton onClick={() => closeClickHandler(false)} size='small'>
							<ClearIcon />
						</IconButton>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	);
};

export default AddStageForm;
