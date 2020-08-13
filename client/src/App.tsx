import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound.page';
import Dashboard from './pages/Dashboard/Dashboard.component';
import LandingPage from './pages/LandingPage/LandingPage.component';
import ProjectHub from './pages/ProjectHub/ProjectHub.page';

function App() {
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
}

export default App;
