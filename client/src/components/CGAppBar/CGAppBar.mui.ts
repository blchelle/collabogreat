import { makeStyles, fade } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	appBar: {
		boxShadow: 'none',
	},
	searchBar: {
		display: 'flex',
		alignItems: 'center',
		width: '30rem',

		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.black, 0.05),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.black, 0.05),
		},
	},
	searchIcon: {
		margin: theme.spacing(1),
	},
	toolBar: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	notificationButton: {
		marginRight: theme.spacing(2),
	},
	createButton: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
		marginRight: theme.spacing(2),
	},
});
