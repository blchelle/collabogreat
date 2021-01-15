import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import LoadingButton from '../LoadingButton/LoadingButton.component';
import { closeModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';

import useStyles from './ConfirmDialog.mui';

interface ConfirmDialogExtras {
	confirmAction: () => void;
	message: string;
}

const ConfirmDialog = () => {
	// MUI Styles
	const classes = useStyles();

	// Redux Hooks
	const { open, extra } = useSelector((state: RootState) => state.modals.CONFIRM_DIALOG);
	const dispatch = useDispatch();

	// Pulls relevant information off the extras
	const confirmAction = (extra as ConfirmDialogExtras)?.confirmAction;
	const message = (extra as ConfirmDialogExtras)?.message;

	return (
		<Dialog open={open}>
			<Grid container>
				<Grid item xs={12} className={classes.warningBanner} />
				<DialogContent>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Typography variant='h5'>Confirm Action</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='body1'>{message}</Typography>
						</Grid>
						<DialogActions className={classes.dismissButton}>
							<LoadingButton
								id='confirm'
								onClick={confirmAction}
								variant='contained'
								color='primary'
							>
								Confirm
							</LoadingButton>
							<Button onClick={() => dispatch(closeModal(ModalNames.CONFIRM_DIALOG))}>
								Cancel
							</Button>
						</DialogActions>
					</Grid>
				</DialogContent>
			</Grid>
		</Dialog>
	);
};

export default ConfirmDialog;
