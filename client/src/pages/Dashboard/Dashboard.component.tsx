import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem } from '@material-ui/core';

interface User {
	displayName: string;
	projects: { title: string; _id: string }[];
	id: string;
}

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const userId = user?.id;

	const fetchUser = async () => {
		const res = await axios('api/v0/user/me', {
			method: 'GET',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		if (res.status !== 200) throw new Error('failed to authenticate user');
		setUser(res.data.user);
	};

	useEffect(() => {
		fetchUser();
	}, [userId]);

	return (
		<div>
			<div>{user?.displayName}</div>
			<List>
				{user?.projects?.map((project) => (
					<ListItem button component='a' href={`projects/${project._id}`}>
						{project.title}
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default Dashboard;
