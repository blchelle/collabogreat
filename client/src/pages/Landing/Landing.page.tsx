import React, { useState } from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import AuthDialog from '../../components/AuthDialog/AuthDialog.component';

const Landing: React.FC = () => {
	const [showAuthPopup, setShowAuthPopup] = useState(false);
	const [authType, setAuthType] = useState<'sign in' | 'sign up'>('sign in');

	return (
		<div>
			<AuthDialog
				open={showAuthPopup}
				type={authType}
				onCloseHandler={() => setShowAuthPopup(false)}
			/>
			<AppBar color='primary' position='fixed'>
				<Toolbar>
					<Typography variant='h6'>CollaboGreat</Typography>
					<Button
						color='inherit'
						onClick={() => {
							setAuthType('sign in');
							setShowAuthPopup(true);
						}}
					>
						Login
					</Button>
					<Button
						color='inherit'
						onClick={() => {
							setAuthType('sign up');
							setShowAuthPopup(true);
						}}
					>
						Sign Up
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default Landing;
