import React, { useState } from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.component';
import AuthCard from '../../components/AuthCard/AuthCard.component';

const LandingPage = () => {
	const [showAuthPopup, setShowAuthPopup] = useState(false);

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
			<LoadingSpinner />
		</div>
	);
};

export default LandingPage;
