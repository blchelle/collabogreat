/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonProps, CircularProgress } from '@material-ui/core';

import { RootState } from '../../redux/root.reducer';
import { startLoading, stopLoading } from '../../redux/loading/loading.actions';

import useStyles from './LoadingButton.mui';

interface LoadingButtonProps extends ButtonProps {
	id: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = (props) => {
	// MUI
	const classes = useStyles();

	// Redux
	const isLoading = useSelector((state: RootState) => state.loading);
	const dispatch = useDispatch();

	// Props
	const { id } = props;

	return (
		<div className={classes.wrapper}>
			<Button
				{...props}
				disabled={(isLoading.show && isLoading.id === id) || props.disabled}
				onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
					// Prevents a loading buttons from being pressed while another is waiting
					if (isLoading.show && isLoading.id !== id) return;

					dispatch(startLoading(id));

					if (props.onClick) props.onClick(event);
					else dispatch(stopLoading());
				}}
			/>
			{isLoading.show && id === isLoading.id && (
				<CircularProgress className={classes.buttonProgress} size={24} />
			)}
		</div>
	);
};

export default LoadingButton;
