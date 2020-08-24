import React, { useState } from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import AuthDisplay from '../../components/AuthDisplay/AuthDisplay.component';

const LandingPage: React.FC = () => {
	const [showAuthPopup, setShowAuthPopup] = useState(false);

	return (
		<div>
			<AuthDisplay open={showAuthPopup} onCloseHandler={() => setShowAuthPopup(false)} />
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
