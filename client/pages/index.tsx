import React from 'react';
import axios from 'axios';
import { NextPage } from 'next';

interface HomeProps {
	message: string;
}

const Home: NextPage<HomeProps> = ({ message }) => {
	return <div>{message}</div>;
};

Home.getInitialProps = async () => {
	const res = await axios({
		method: 'GET',
		url: 'http://localhost:8000/api',
	});
	const { message } = res.data;

	return { message };
};

export default Home;
