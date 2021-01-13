import axios from 'axios';
import environment from './environment.config';

if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = environment.development.apiBaseUrl;
} else {
	axios.defaults.baseURL = environment.production.apiBaseUrl;
}

axios.defaults.withCredentials = true;
axios.defaults.headers = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Credentials': true,
};

export default axios;
