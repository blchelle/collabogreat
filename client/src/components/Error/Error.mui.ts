import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	errorBanner: {
		backgroundColor: theme.palette.error.main,
		height: '2rem',
	},
	dismissButton: {
		marginLeft: 'auto',
	},
});
