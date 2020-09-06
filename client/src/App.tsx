import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import Loading from './pages/Loading/Loading.page';
import { fetchCurrentUser } from './redux/user/user.actions';
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

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, []);

	return (
		<div className='App'>
			<Suspense fallback={<Loading />}>
				{isAuthenticated ? (
					<>
						<CGAppBar />
						<CreateProjectDialog />
					</>
				) : (
					<Redirect to='/' />
				)}

				<Switch>
					<Route exact path='/'>
						{isAuthenticated ? <Redirect to='/me' /> : <LandingPage />}
					</Route>
					<Route exact path='/me' component={Dashboard} />
					<Route exact path='/loading' component={Loading} />
					<Route path='/projects/:id' component={ProjectHub} />
					<Route path='*' component={NotFound} />
				</Switch>
			</Suspense>
		</div>
	);
};

export default App;
