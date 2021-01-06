import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import Routes from './routes';
import CGAppBar from './components/CGAppBar/CGAppBar.component';
import CreateProjectDialog from './components/CreateProjectDialog/CreateProjectDialog.component';
import CreateTaskDialog from './components/CreateTaskDialog/CreateTaskDialog.component';
import Error from './components/Error/Error.component';
import Loading from './pages/Loading/Loading.page';
import { fetchTasksStart } from './redux/tasks/tasks.actions';
import { RootState } from './redux/root.reducer';
import theme from './theme';

const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.page'));
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound.page'));
const ProjectBoard = React.lazy(() => import('./pages/ProjectBoard/ProjectBoard.page'));
// const ProjectHub = React.lazy(() => import('./pages/ProjectHub/ProjectHub.page'));

const Authenticated = () => {
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const projectIds = useSelector((state: RootState) => state.projects).map(
		(project) => project._id!
	);

	useEffect(() => {
		// Calls the fetch tasks handler
		if (projectIds.length !== 0) {
			dispatch(fetchTasksStart(projectIds));
		}
	}, [...projectIds, dispatch]);

	return (
		<Suspense fallback={<Loading />}>
			{Routes.some((regex) => regex.test(pathname)) ? (
				<>
					<CGAppBar />
					<Grid
						container
						direction='column'
						style={{
							marginTop: theme.spacing(2),
							padding: theme.spacing(1),
						}}
					>
						<Switch>
							<Route exact path='/'>
								<Redirect to='/dashboard' />
							</Route>
							<Route exact path='/dashboard' component={Dashboard} />
							<Route exact path='/loading' component={Loading} />
							{/* <Route path='/projects/:id' component={ProjectHub} /> */}
							<Route exact path='/projects/:id/board' component={ProjectBoard} />
						</Switch>
					</Grid>
				</>
			) : (
				<NotFound />
			)}
			<CreateProjectDialog />
			<CreateTaskDialog />
			<Error />
		</Suspense>
	);
};

export default Authenticated;
