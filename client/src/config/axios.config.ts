import axios from 'axios';

if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = 'http://localhost:8000';
}

axios.defaults.withCredentials = true;
axios.defaults.headers = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Credentials': true,
};

export default axios;
