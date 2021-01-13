import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		errorBanner: {
			backgroundColor: theme.palette.error.main,
			height: '2rem',
		},
		dismissButton: {
			marginLeft: 'auto',
		},
	};
});
