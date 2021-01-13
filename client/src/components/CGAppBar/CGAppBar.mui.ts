import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		appBar: {
			boxShadow: 'none',
			flex: '0 1 auto',
			backgroundColor: theme.palette.background.paper,
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
			backgroundColor: theme.palette.background.default,
			'&:hover': {
				backgroundColor: theme.palette.background.default,
			},
		},
		searchBarMobile: {
			order: 1,
			margin: 0,
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
		},
		searchIcon: {
			margin: theme.spacing(1),
			fill: theme.palette.getContrastText(theme.palette.background.paper),
		},
		createButton: {
			boxShadow: 'none',
		},
		notificationsButton: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
		},
	};
});
