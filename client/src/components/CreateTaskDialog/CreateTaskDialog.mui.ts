import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		dialog: {
			maxHeight: '90vh',
		},
		dialogLeft: {
			background: `linear-gradient(to right bottom, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
			padding: theme.spacing(4),
		},
		dialogRight: {
			padding: theme.spacing(4),
		},
		dialogLeftImage: {
			width: '75%',
			height: 'auto',
		},
		colorButton: {
			justifyContent: 'center',
			alignItems: 'center',
			padding: 4,
		},
		color: {
			width: theme.spacing(5),
			height: theme.spacing(4),
			transition: 'filter 0.1s',

			'&:hover': {
				filter: 'brightness(85%)',
			},
		},
		selectedColor: {
			border: `3px solid ${theme.palette.getContrastText(theme.palette.background.default)}`,
			padding: theme.spacing(1),
		},
	};
});
