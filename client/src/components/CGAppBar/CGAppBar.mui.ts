import { makeStyles, fade } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	appBar: {
		boxShadow: 'none',
		flex: '0 1 auto',
	},
	toolBar: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	searchBar: {
		display: 'flex',
		alignItems: 'center',
		maxWidth: '45rem',
		marginRight: theme.spacing(5),
		marginLeft: theme.spacing(5),

		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.black, 0.05),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.black, 0.05),
		},
	},
	searchBarMobile: {
		order: 1,
		margin: 0,
	},
	searchIcon: {
		margin: theme.spacing(1),
	},
	createButton: {
		boxShadow: 'none',
	},
	notificationsButton: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
});
