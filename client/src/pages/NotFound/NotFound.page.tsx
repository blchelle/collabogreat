import React from 'react';
import { Container, Grid, Link, Typography, useMediaQuery, Button } from '@material-ui/core';

import { ReactComponent as UDNotFound } from '../../assets/404.undraw.svg';
import useStyles from './NotFound.mui';
import theme from '../../theme';

const NotFound: React.FC = () => {
	const classes = useStyles();

	// Figure out the current screen size
	const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.down('md')) && !isPhone;
	const isDesktop = !isPhone && !isTablet;

	const mobileOrTablet = (
		<Container className={classes.container} maxWidth='xl'>
			<Grid container justify='center' spacing={5}>
				<Grid item xs={12} container justify='center'>
					<Typography variant={isTablet ? 'h4' : 'h6'}>Hmmm...Something is Wrong Here.</Typography>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={2} />
					<Grid item xs>
						<UDNotFound className={classes.svgImage} />
					</Grid>
					<Grid item xs={2} />
				</Grid>
				<Grid item xs={12} container justify='center'>
					<Typography variant={isTablet ? 'h6' : 'body1'}>
						Uh oh! It looks like you’ve lost your way.
						<br />
						Let us take you back to safety
					</Typography>
				</Grid>
				<Grid item container justify='center'>
					<Link href='/dashboard'>TAKE ME BACK</Link>
				</Grid>
			</Grid>
		</Container>
	);

	const desktop = (
		<Container className={classes.container} maxWidth='xl'>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant='h2'>Hmmm...Something is Wrong Here.</Typography>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={5} container direction='column' justify='space-around'>
						<Typography variant='h5'>
							Uh oh! It looks like you’ve lost your way. Let us take you back to safety
						</Typography>
						<Grid item container justify='center'>
							<Button variant='outlined' color='primary' href='/dashboard'>
								TAKE ME BACK
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={7} container justify='center'>
						<UDNotFound className={classes.svgImage} />
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);

	return isDesktop ? desktop : mobileOrTablet;
};

export default NotFound;
