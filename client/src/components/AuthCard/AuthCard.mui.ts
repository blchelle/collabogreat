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
		'&:not(:last-child)': {
			marginBottom: '0.625rem',
		},
		'&:hover': {
			transform: 'translateY(-2px)',
		},
	},
	buttonIcon: {
		height: '2rem',
		width: 'auto',
	},
});
