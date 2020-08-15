import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import AuthCard from '../../components/AuthCard/AuthCard.component';
import { RootState } from '../../redux/root.reducer';

const LandingPage: React.FC = () => {
	const [showAuthPopup, setShowAuthPopup] = useState(false);

	// Determines if there is an authenticated user, redirects if so
	const isAuthenticated = useSelector((state: RootState) => {
		console.log(state);
		return state.user !== null;
	});
	console.log(isAuthenticated);

	if (isAuthenticated) return <Redirect to='/dashboard' />;

	return (
		<div>
			{showAuthPopup ? <AuthCard /> : null}
			<AppBar color='primary' position='fixed'>
				<Toolbar>
					<Typography variant='h6'>CollaboGreat</Typography>
					<Button color='inherit' onClick={() => setShowAuthPopup(true)}>
						Login
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default LandingPage;
