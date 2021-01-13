import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		topLine: {
			backgroundColor: theme.palette.primary.main,
			height: theme.spacing(1),
			width: '100%',
		},
		closeIcon: {
			alignSelf: 'flex-end',
			marginTop: theme.spacing(1),
			marginRight: theme.spacing(1),
		},
		headerContainer: {
			marginBottom: theme.spacing(2),
			marginTop: theme.spacing(-2),
		},
		widthXS: {
			width: '20rem',
		},
		dialogTitle: {
			textAlign: 'center',
			fontSize: '1.5rem',
		},
		facebookButton: {
			backgroundColor: '#4667b2',
			color: '#fff',
			'&:hover': {
				backgroundColor: '#3f5ca2',
			},
		},
		googleButton: {
			backgroundColor: '#e6e6e6',
			'&:hover': {
				backgroundColor: '#d6d6d6',
			},
		},
		githubButton: {
			backgroundColor: '#333',
			color: '#fff',
			'&:hover': {
				backgroundColor: '#1f1f1f',
			},
		},
		providerButton: {
			height: '3.125rem',
			display: 'flex',
			justifyContent: 'start',
			transition: 'all 0.1s ease-in-out',
		},
		buttonIcon: {
			height: '2rem',
			width: 'auto',
		},
	};
});
