import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import CGAppBar from './components/CGAppBar/CGAppBar.component';
import CreateProjectDialog from './components/CreateProjectDialog/CreateProjectDialog.component';
import Loading from './pages/Loading/Loading.page';

const NotFound = React.lazy(() => import('./pages/NotFound/NotFound.page'));
const ProjectHub = React.lazy(() => import('./pages/ProjectHub/ProjectHub.page'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.component'));

const Authenticated = () => {
	return (
		<>
			<CGAppBar />
			<Switch>
				<Route exact path='/'>
					<Redirect to='/dashboard' />
				</Route>
				<Route exact path='/dashboard' component={Dashboard} />
				<Route exact path='/loading' component={Loading} />
				<Route path='/projects/:id' component={ProjectHub} />
				<Route path='*' component={NotFound} />
			</Switch>
			<CreateProjectDialog />
		</>
	);
};

export default Authenticated;
