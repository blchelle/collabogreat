import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		container: {
			background: theme.palette.background.default,
			'&:hover .MuiCardContent-root': {
				opacity: 0.6,
			},
			transition: 'opacity 0.1s',

			'&:hover button': {
				opacity: 1,
			},
		},
		cardHead: {
			height: theme.spacing(4),
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
		avatar: {
			height: theme.spacing(3),
			width: theme.spacing(3),
			marginLeft: theme.spacing(1),
		},
	};
});
