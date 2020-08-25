import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import CGAppBar from './components/CGAppBar/CGAppBar.component';
import Dashboard from './pages/Dashboard/Dashboard.component';
import LandingPage from './pages/LandingPage/LandingPage.component';
import NotFound from './pages/NotFound/NotFound.page';
import ProjectHub from './pages/ProjectHub/ProjectHub.page';
import { RootState } from './redux/root.reducer';
import './App.css';

const App: React.FC = () => {
	const isAuthenticated = useSelector((state: RootState) => state.user !== null);

	return (
		<div className='App'>
			{isAuthenticated ? <CGAppBar /> : null}
			<Switch>
				<Route exact path='/' component={LandingPage} />
				<Route exact path='/dashboard' component={Dashboard} />
				<Route path='/projects/:id' component={ProjectHub} />
				<Route path='*' component={NotFound} />
			</Switch>
		</div>
	);
};

export default App;
