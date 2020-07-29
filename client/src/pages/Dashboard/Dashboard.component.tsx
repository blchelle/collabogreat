import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface User {
	displayName: string;
	id: string;
}

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);

	console.log('I am inside the dashboard');

	useEffect(() => {
		console.log('Inside the use effect hook');

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
				console.log(res);

				if (res.status === 200) return res.data;
				throw new Error('failed to authenticate user');
			})
			.then((responseJson) => {
				setUser(responseJson.user);
			})
			.catch((err) => {
				setUser(null);
			});
	}, [user?.id]);

	return <div>{user?.displayName}</div>;
};

export default Dashboard;
