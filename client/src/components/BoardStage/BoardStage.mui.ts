import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	container: {
		width: 270,
		marginRight: theme.spacing(2),
		maxHeight: '100%',
		overflowY: 'auto',
	},
	cardContent: {
		backgroundColor: theme.palette.background.paper,
		width: 270,
		paddingBottom: -1 * theme.spacing(1),
	},
	stageHeader: {
		padding: theme.spacing(2),
		paddingBottom: 0,
	},
	stageTitle: {
		fontWeight: 'bold',
	},
	addTaskButton: {
		backgroundColor: theme.palette.background.paper,
		margin: theme.spacing(2),
		marginTop: theme.spacing(1),
	},
});
