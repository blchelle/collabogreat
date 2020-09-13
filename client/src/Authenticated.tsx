import React, { Suspense } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import Routes from './routes';
import CGAppBar from './components/CGAppBar/CGAppBar.component';
import CreateProjectDialog from './components/CreateProjectDialog/CreateProjectDialog.component';
import Loading from './pages/Loading/Loading.page';

const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.page'));
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound.page'));
// const ProjectHub = React.lazy(() => import('./pages/ProjectHub/ProjectHub.page'));

const Authenticated = () => {
	const { pathname } = useLocation();

	return (
		<Suspense fallback={<Loading />}>
			{Object.values(Routes).includes(pathname) ? (
				<>
					<CGAppBar />
					<Switch>
						<Route exact path='/'>
							<Redirect to='/dashboard' />
						</Route>
						<Route exact path='/dashboard' component={Dashboard} />
						<Route exact path='/loading' component={Loading} />
						{/* <Route path='/projects/:id' component={ProjectHub} /> */}
					</Switch>
				</>
			) : (
				<NotFound />
			)}
			<CreateProjectDialog />
		</Suspense>
	);
};

export default Authenticated;
