import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { createMuiTheme, Paper } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import Loading from './pages/Loading/Loading.page';
import Landing from './pages/Landing/Landing.page';
import { fetchCurrentUser } from './redux/user/user.actions';
import { RootState } from './redux/root.reducer';
import baseTheme from './config/theme.config';

import useStyles from './App.mui';

const Authenticated = React.lazy(() => import('./Authenticated'));

const App: React.FC = () => {
	// MUI
	const classes = useStyles();

	// Redux
	const isAuthenticated = useSelector((state: RootState) => state.user !== null);
	const colorTheme = useSelector((state: RootState) => state.theme);
	const dispatch = useDispatch();

	// Material UI
	const theme = createMuiTheme({
		...baseTheme,
		palette: {
			...baseTheme.palette,
			type: colorTheme,
		},
	});

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, [dispatch]);

	return (
		<ThemeProvider theme={theme}>
			<Paper className={classes.app} style={{ backgroundColor: theme.palette.background.default }}>
				{isAuthenticated ? (
					<Suspense fallback={<Loading />}>
						<Authenticated />
					</Suspense>
				) : (
					<>
						<Redirect to='/' />
						<Switch>
							<Route exact path='/' component={Landing} />
						</Switch>
					</>
				)}
			</Paper>
		</ThemeProvider>
	);
};

export default App;
