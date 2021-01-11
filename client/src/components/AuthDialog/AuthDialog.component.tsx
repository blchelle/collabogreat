import React from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	Grid,
	IconButton,
	List,
	ListItem,
	SvgIcon,
	Typography,
} from '@material-ui/core';
import {
	Facebook as FacebookLogo,
	GitHub as GitHubLogo,
	Close as CloseIcon,
} from '@material-ui/icons';

import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as GoogleLogo } from '../../assets/google-logo.svg';
import useStyles from './AuthDialog.mui';
import theme from '../../theme';

interface AuthDialogProps {
	open: boolean;
	onCloseHandler: () => void;
	type: 'sign in' | 'sign up';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onCloseHandler, type }) => {
	const classes = useStyles();
	const providerButtonClasses = classes.providerButton;
	const facebookButtonClasses = `${classes.facebookButton} ${providerButtonClasses}`;
	const googleButtonClasses = `${classes.googleButton} ${providerButtonClasses}`;
	const githubButtonClasses = `${classes.githubButton} ${providerButtonClasses}`;
	const buttonIconClasses = classes.buttonIcon;

	return (
		<Dialog
			maxWidth='xs'
			open={open}
			onClose={onCloseHandler}
			classes={{ paperWidthXs: classes.widthXS }}
		>
			<div style={{ backgroundColor: theme.palette.primary.main, height: 16, width: '100%' }} />
			<IconButton
				style={{
					alignSelf: 'flex-end',
					marginTop: theme.spacing(1),
					marginRight: theme.spacing(1),
				}}
				onClick={onCloseHandler}
			>
				<CloseIcon />
			</IconButton>
			<Grid
				container
				direction='column'
				alignItems='center'
				style={{ marginBottom: theme.spacing(2), marginTop: theme.spacing(-2) }}
			>
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
							href='http://localhost:8000/api/v0/auth/facebook'
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
							href='http://localhost:8000/api/v0/auth/google'
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
							href='http://localhost:8000/api/v0/auth/github'
						>
							Github
						</Button>
					</ListItem>
				</List>
			</DialogContent>
		</Dialog>
	);
};

export default AuthDialog;
