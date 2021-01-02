import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

export default makeStyles({
	container: {
		'&:hover .MuiCardContent-root': {
			opacity: 0.6,
		},
		transition: 'opacity 0.1s',

		'&:hover .makeStyles-iconButton-25': {
			opacity: 1,
		},
	},
	iconButton: {
		backgroundColor: theme.palette.grey[900],
		borderRadius: 4,
		height: 16,
		width: 16,
		opacity: 0,
		marginRight: 4,
		transition: 'opacity 0.1s',

		'&:hover': {
			backgroundColor: theme.palette.grey[900],
		},

		'&:hover path': {
			fill: theme.palette.grey[300],
		},
	},
	icon: {
		fill: theme.palette.grey[500],
		height: 16,
		transition: 'fill 0.1s',
	},
});
