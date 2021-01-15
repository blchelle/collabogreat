import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@material-ui/core';

import useStyles from './Error.mui';
import { closeError } from '../../redux/error/error.actions';
import { RootState } from '../../redux/root.reducer';

const Error = () => {
	// MUI Styles
	const classes = useStyles();

	// Redux Hooks
	const { open, description, solution } = useSelector((state: RootState) => state.error);
	const dispatch = useDispatch();

	return (
		<Dialog open={open}>
			<Grid container>
				<Grid item xs={12} className={classes.errorBanner} />
				<DialogContent>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Typography variant='h5'>{description}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='body1'>{solution}</Typography>
						</Grid>
						<DialogActions className={classes.dismissButton}>
							<Button onClick={() => dispatch(closeError())}>Dismiss</Button>
						</DialogActions>
					</Grid>
				</DialogContent>
			</Grid>
		</Dialog>
	);
};

export default Error;
