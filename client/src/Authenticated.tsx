import React, { Suspense } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import Routes from './routes';
import CGAppBar from './components/CGAppBar/CGAppBar.component';
import CreateProjectDialog from './components/CreateProjectDialog/CreateProjectDialog.component';
import Error from './components/Error/Error.component';
import Loading from './pages/Loading/Loading.page';

const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.page'));
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound.page'));
const ProjectBoard = React.lazy(() => import('./pages/ProjectBoard/ProjectBoard.page'));
// const ProjectHub = React.lazy(() => import('./pages/ProjectHub/ProjectHub.page'));

const Authenticated = () => {
	const { pathname } = useLocation();
	console.log(Object.values(Routes));

	return (
		<Suspense fallback={<Loading />}>
			{Routes.some((regex) => regex.test(pathname)) ? (
				<>
					<CGAppBar />
					<Switch>
						<Route exact path='/'>
							<Redirect to='/dashboard' />
						</Route>
						<Route exact path='/dashboard' component={Dashboard} />
						<Route exact path='/loading' component={Loading} />
						{/* <Route path='/projects/:id' component={ProjectHub} /> */}
						<Route exact path='/projects/:id/board' component={ProjectBoard} />
					</Switch>
				</>
			) : (
				<NotFound />
			)}
			<CreateProjectDialog />
			<Error />
		</Suspense>
	);
};

export default Authenticated;
