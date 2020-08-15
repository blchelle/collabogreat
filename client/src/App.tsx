import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.component';
import LandingPage from './pages/LandingPage/LandingPage.component';
import ProjectHub from './pages/ProjectHub/ProjectHub.page';
import NotFound from './pages/NotFound/NotFound.page';

const App: React.FC = () => {
	return (
		<div className='App'>
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
