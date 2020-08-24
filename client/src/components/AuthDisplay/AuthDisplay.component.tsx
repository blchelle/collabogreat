import React from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	Grid,
	List,
	ListItem,
	SvgIcon,
	Typography,
} from '@material-ui/core';
import { Facebook as FacebookLogo, GitHub as GitHubLogo } from '@material-ui/icons';

import { ReactComponent as LogoText } from '../../assets/logo-text.svg';
import { ReactComponent as GoogleLogo } from '../../assets/google-logo.svg';
import useStyles from './AuthDisplay.mui';
import theme from '../../theme';

interface AuthDisplayProps {
	open: boolean;
	onCloseHandler: () => void;
}

const AuthDisplay: React.FC<AuthDisplayProps> = ({ open, onCloseHandler }) => {
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
			<Grid
				container
				direction='column'
				alignItems='center'
				style={{ marginBottom: theme.spacing(2), marginTop: theme.spacing(2) }}
			>
				<Typography variant='h5' classes={{ root: classes.dialogTitle }}>
					Sign in to
				</Typography>
				<LogoText />
			</Grid>
			<DialogContent>
				<Typography variant='body1' align='center'>
					We pinky promise not to steal all of your information and ruin your life
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

export default AuthDisplay;
