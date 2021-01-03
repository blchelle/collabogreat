import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	container: {
		padding: theme.spacing(1),
		overflowX: 'auto',
	},
	addStageButton: {
		height: 50,
		width: 270,
	},
	addStageForm: {
		padding: theme.spacing(1),
		backgroundColor: theme.palette.background.paper,
		height: 100,
		width: 270,
	},
});
