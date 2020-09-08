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
		marginBottom: '5px',
		marginRight: theme.spacing(6),
	},
	menu: {
		padding: 0,
	},
	menuItem: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		transition: 'color 0.2s',
		'&:hover': {
			color: theme.palette.primary.main,
			backgroundColor: 'inherit',
		},
	},
	marginRight: {
		marginRight: theme.spacing(2),
	},
});
