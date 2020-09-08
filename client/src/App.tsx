import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import Loading from './pages/Loading/Loading.page';
import Landing from './pages/Landing/Landing.page';
import { fetchCurrentUser } from './redux/user/user.actions';
import { RootState } from './redux/root.reducer';
import './App.css';

const Authenticated = React.lazy(() => import('./Authenticated'));

const App: React.FC = () => {
	const isAuthenticated = useSelector((state: RootState) => state.user !== null);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, []);

	return (
		<div className='App'>
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
		</div>
	);
};

export default App;
