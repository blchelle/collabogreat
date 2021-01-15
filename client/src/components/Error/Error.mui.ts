import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		errorBanner: {
			backgroundColor: theme.palette.error.main,
			height: theme.spacing(3),
		},
		dismissButton: {
			marginLeft: 'auto',
		},
	};
});
