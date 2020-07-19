import axios from 'axios';

const Home = ({ message }) => {
	return <div>{message}</div>;
};

Home.getInitialProps = async () => {
	const res = await axios({
		method: 'GET',
		url: 'http://localhost:8000/api',
	});
	const data = res.data;
	const message = data.message;

	return { message };
};

export default Home;
