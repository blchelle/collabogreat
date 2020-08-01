import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Button } from '@material-ui/core';

interface User {
	displayName: string;
	id: string;
}

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const userId = user?.id;

	useEffect(() => {
		axios('api/v0/auth/login/success', {
			method: 'GET',
			withCredentials: true,
			headers: {
				Accecpt: 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		})
			.then((res: AxiosResponse) => {
				if (res.status === 200) return res.data;
				throw new Error('failed to authenticate user');
			})
			.then((responseJson) => {
				setUser(responseJson.user);
			})
			.catch((err) => {
				setUser(null);
			});
	}, [userId]);

	const logout = async () => {
		try {
			const res = await axios('/api/v0/auth/logout', {
				method: 'GET',
				headers: {
					Accecpt: 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Credentials': true,
				},
			});

			setUser(null);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<div>{user?.displayName}</div>
			<Button onClick={() => logout()}>Log Out</Button>
		</>
	);
};

export default Dashboard;
