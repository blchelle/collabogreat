import React from 'react';

import { Button, Card, SvgIcon, Typography } from '@material-ui/core';
import { Facebook as FacebookLogo, GitHub as GitHubLogo } from '@material-ui/icons';
import useStyles from './AuthCard.mui';

import { ReactComponent as GoogleLogo } from '../../assets/google-logo.svg';

const AuthCard: React.FC = () => {
	const authCardClasses = useStyles().authCard;
	const providerButtonClasses = useStyles().providerButton;
	const facebookButtonClasses = `${useStyles().facebookButton} ${providerButtonClasses}`;
	const googleButtonClasses = `${useStyles().googleButton} ${providerButtonClasses}`;
	const githubButtonClasses = `${useStyles().githubButton} ${providerButtonClasses}`;
	const buttonIconClasses = useStyles().buttonIcon;

	return (
		<Card raised className={authCardClasses}>
			<Typography variant='h5' align='center'>
				Sign in to
			</Typography>
			<Button
				className={facebookButtonClasses}
				variant='outlined'
				fullWidth
				startIcon={<FacebookLogo className={buttonIconClasses} />}
				onClick={() => window.open('http://localhost:8000/api/v0/auth/facebook', '_self')}
			>
				Facebook
			</Button>
			<Button
				className={googleButtonClasses}
				variant='outlined'
				fullWidth
				startIcon={<SvgIcon component={GoogleLogo} className={buttonIconClasses} />}
				onClick={() => window.open('http://localhost:8000/api/v0/auth/google', '_self')}
			>
				Google
			</Button>
			<Button
				className={githubButtonClasses}
				variant='outlined'
				fullWidth
				startIcon={<GitHubLogo className={buttonIconClasses} />}
				onClick={() => window.open('http://localhost:8000/api/v0/auth/github', '_self')}
			>
				Github
			</Button>
		</Card>
	);
};

export default AuthCard;