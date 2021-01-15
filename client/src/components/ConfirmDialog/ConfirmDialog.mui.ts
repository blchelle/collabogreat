import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		warningBanner: {
			backgroundColor: theme.palette.warning.main,
			height: theme.spacing(3),
		},
		dismissButton: {
			marginLeft: 'auto',
		},
	};
});
