import React, { useState } from 'react';
import {
	AppBar,
	Box,
	Button,
	Container,
	createMuiTheme,
	Grid,
	Paper,
	ThemeProvider,
	Toolbar,
	Typography,
	useMediaQuery,
} from '@material-ui/core';

import baseTheme from '../../config/theme.config';
import AuthDialog from '../../components/AuthDialog/AuthDialog.component';
import { ReactComponent as TeamUD } from '../../assets/team.undraw.svg';

import useStyles from './Landing.mui';

const Landing: React.FC = () => {
	// MUI
	const classes = useStyles();
	const theme = createMuiTheme({ ...baseTheme, palette: { ...baseTheme.palette, type: 'dark' } });
	const screenIsSmall = useMediaQuery(theme.breakpoints.down('md'));

	// Component State
	const [showAuthPopup, setShowAuthPopup] = useState(false);
	const [authType, setAuthType] = useState<'sign in' | 'sign up'>('sign in');

	return (
		<ThemeProvider theme={theme}>
			<Paper className={classes.landing}>
				<AuthDialog
					open={showAuthPopup}
					type={authType}
					onCloseHandler={() => setShowAuthPopup(false)}
				/>
				<Grid item>
					<AppBar color='transparent' position='fixed' className={classes.appBar}>
						<Toolbar>
							<Grid container justify='flex-end' alignItems='center'>
								<Grid item container spacing={2} style={{ width: 'auto' }}>
									<Grid item>
										<Button
											color='inherit'
											onClick={() => {
												setAuthType('sign in');
												setShowAuthPopup(true);
											}}
										>
											Login
										</Button>
									</Grid>
									<Grid item>
										<Button
											color='inherit'
											variant='outlined'
											onClick={() => {
												setAuthType('sign up');
												setShowAuthPopup(true);
											}}
										>
											Sign Up
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Toolbar>
					</AppBar>
				</Grid>
				<Grid item>
					<Container maxWidth='xl' className={classes.container}>
						<Grid container alignItems='center' justify='center' spacing={2}>
							<Grid item xs={12} lg={6} container direction='column' spacing={1}>
								<Grid item>
									<Typography variant={screenIsSmall ? 'h5' : 'h3'}>
										<Box fontWeight='bold'>
											CollaboGreat improves team collaboration so you can get more done.
										</Box>
									</Typography>
								</Grid>
								{screenIsSmall ? null : (
									<Grid item>
										<Typography variant='h5'>
											CollaboGreat is a lightweight team collaboration software that simplifies the
											process of organizing the workload of any project.
										</Typography>
									</Grid>
								)}
								{screenIsSmall ? null : (
									<Grid item style={{ marginTop: 40 }}>
										<Button
											variant='contained'
											color='secondary'
											size='large'
											onClick={() => {
												setAuthType('sign up');
												setShowAuthPopup(true);
											}}
										>
											<Box fontWeight='bold'>
												<Typography>Get Started - It&apos;s Free!</Typography>
											</Box>
										</Button>
									</Grid>
								)}
							</Grid>
							<Grid item container xs={8} md={6} justify='center'>
								<TeamUD className={screenIsSmall ? classes.teamSvgMobile : classes.teamSvg} />
								{screenIsSmall ? (
									<Grid item style={{ marginTop: 40 }}>
										<Button
											variant='contained'
											color='secondary'
											onClick={() => {
												setAuthType('sign up');
												setShowAuthPopup(true);
											}}
										>
											Get Started!
										</Button>
									</Grid>
								) : null}
							</Grid>
						</Grid>
					</Container>
				</Grid>
			</Paper>
		</ThemeProvider>
	);
};

export default Landing;
