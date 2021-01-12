import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	paper: {
		padding: theme.spacing(2),
	},
	avatar: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
	header: {
		marginBottom: 5,
		marginRight: theme.spacing(6),
	},
	menu: {
		padding: 0,
	},
	marginRight: { marginRight: theme.spacing(2) },
});
