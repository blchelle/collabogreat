import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
	authCard: {
		width: '18.75rem',
		position: 'fixed',
		left: '50%',
		top: '50%',
		transform: 'translateX(-50%) translateY(-50%)',
		padding: '1.5625rem',
	},
	facebookButton: {
		backgroundColor: '#4667b2',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#003d82',
		},
	},
	googleButton: {
		backgroundColor: '#e6e6e6',
		'&:hover': {
			backgroundColor: '#b4b4b4',
		},
	},
	githubButton: {
		backgroundColor: '#333',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#0c0c0c',
		},
	},
	providerButton: {
		height: '3.125rem',
		display: 'flex',
		justifyContent: 'start',
		'&:not(:last-child)': {
			marginBottom: '0.625rem',
		},
	},
	buttonIcon: {
		fontSize: '3rem',
	},
});
