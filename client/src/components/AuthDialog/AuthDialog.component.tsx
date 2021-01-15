import React from 'react';
import {
	Button,
	createMuiTheme,
	Dialog,
	DialogContent,
	Grid,
	IconButton,
	List,
	ListItem,
	SvgIcon,
	ThemeProvider,
	Typography,
} from '@material-ui/core';
import {
	Facebook as FacebookLogo,
	GitHub as GitHubLogo,
	Close as CloseIcon,
} from '@material-ui/icons';

import environment from '../../config/environment.config';
import baseTheme from '../../config/theme.config';
import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as GoogleLogo } from '../../assets/google-logo.svg';
import useStyles from './AuthDialog.mui';

interface AuthDialogProps {
	open: boolean;
	onCloseHandler: () => void;
	type: 'sign in' | 'sign up';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onCloseHandler, type }) => {
	// MUI
	const classes = useStyles();

	const theme = createMuiTheme({
		...baseTheme,
	});

	const providerButtonClasses = classes.providerButton;
	const facebookButtonClasses = `${classes.facebookButton} ${providerButtonClasses}`;
	const googleButtonClasses = `${classes.googleButton} ${providerButtonClasses}`;
	const githubButtonClasses = `${classes.githubButton} ${providerButtonClasses}`;
	const buttonIconClasses = classes.buttonIcon;

	return (
		<ThemeProvider theme={theme}>
			<Dialog
				maxWidth='xs'
				open={open}
				onClose={onCloseHandler}
				classes={{ paperWidthXs: classes.widthXS }}
			>
				<div className={classes.topLine} />
				<IconButton className={classes.closeIcon} onClick={onCloseHandler}>
					<CloseIcon />
				</IconButton>
				<Grid container direction='column' alignItems='center' className={classes.headerContainer}>
					<Typography variant='h5' classes={{ root: classes.dialogTitle }}>
						{`${type === 'sign in' ? 'Sign in to' : 'Sign up for'}`}
					</Typography>
					<LogoText />
				</Grid>
				<DialogContent>
					<Typography variant='body1' align='center'>
						{type === 'sign in'
							? 'Use any of the providers below to sign into your account'
							: 'Use any of the providers below to create an account'}
					</Typography>
					<List>
						<ListItem>
							<Button
								className={facebookButtonClasses}
								variant='outlined'
								fullWidth
								startIcon={<FacebookLogo className={buttonIconClasses} />}
								href={`${
									environment[process.env.NODE_ENV as 'development' | 'production'].apiBaseUrl
								}/auth/facebook`}
							>
								Facebook
							</Button>
						</ListItem>
						<ListItem>
							<Button
								className={googleButtonClasses}
								variant='outlined'
								fullWidth
								startIcon={<SvgIcon component={GoogleLogo} className={buttonIconClasses} />}
								href={`${
									environment[process.env.NODE_ENV as 'development' | 'production'].apiBaseUrl
								}/auth/google`}
							>
								Google
							</Button>
						</ListItem>
						<ListItem>
							<Button
								className={githubButtonClasses}
								variant='outlined'
								fullWidth
								startIcon={<GitHubLogo className={buttonIconClasses} />}
								href={`${
									environment[process.env.NODE_ENV as 'development' | 'production'].apiBaseUrl
								}/auth/github`}
							>
								Github
							</Button>
						</ListItem>
					</List>
				</DialogContent>
			</Dialog>
		</ThemeProvider>
	);
};

export default AuthDialog;
