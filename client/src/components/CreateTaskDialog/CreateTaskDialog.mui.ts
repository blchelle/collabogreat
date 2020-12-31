import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
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
});
