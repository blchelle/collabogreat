import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	container: {
		width: 270,
		overflowY: 'auto',
	},
	stageTitle: {
		padding: theme.spacing(2),
		paddingBottom: 0,
		fontWeight: 'bold',
	},
	addTaskButton: {
		backgroundColor: theme.palette.background.paper,
		justifySelf: 'stretch',
		margin: theme.spacing(2),
		marginTop: theme.spacing(1),
	},
});
