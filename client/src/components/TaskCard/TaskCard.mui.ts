import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	container: {
		height: '100%',
	},
	cardHead: {
		backgroundColor: theme.palette.primary.main,
		height: theme.spacing(2),
	},
	cardDescription: {
		marginBottom: theme.spacing(2),
	},
	cardStatus: {
		marginBottom: theme.spacing(2),
	},
	cardProject: {
		justifySelf: 'flex-end',
	},
});
