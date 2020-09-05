import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.component';
import { RootState } from './redux/root.reducer';
import './App.css';

const NotFound = React.lazy(() => import('./pages/NotFound/NotFound.page'));
const CGAppBar = React.lazy(() => import('./components/CGAppBar/CGAppBar.component'));
const CreateProjectDialog = React.lazy(() =>
	import('./components/CreateProjectDialog/CreateProjectDialog.component')
);
const LandingPage = React.lazy(() => import('./pages/LandingPage/LandingPage.component'));

const ProjectHub = React.lazy(() => import('./pages/ProjectHub/ProjectHub.page'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.component'));

const App: React.FC = () => {
	const isAuthenticated = useSelector((state: RootState) => state.user !== null);

	return (
		<div className='App'>
			{isAuthenticated ? (
				<Suspense fallback={<LoadingSpinner />}>
					<CGAppBar />
					<CreateProjectDialog />
				</Suspense>
			) : null}
			<Suspense fallback={<LoadingSpinner />}>
				<Switch>
					<Route exact path='/' component={LandingPage} />
					<Route exact path='/dashboard' component={Dashboard} />
					<Route path='/projects/:id' component={ProjectHub} />
					<Route path='*' component={NotFound} />
				</Switch>
			</Suspense>
		</div>
	);
};

export default App;
