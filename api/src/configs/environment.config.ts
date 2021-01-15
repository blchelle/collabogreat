export default {
	development: {
		version: 0,
		port: 8000,
		clientBaseURL: 'http://localhost:3000',
		baseURL: 'http://localhost:8000/api',
		oauth: {
			successRoute: 'http://localhost:3000/dashboard',
			failureRoute: 'http://localhost:3000',
		},
		rateLimit: {
			maxRequests: 100,
			timeWindow: 1, // Time in minutes
		},
	},
	production: {
		version: 0,
		port: 8000,
		clientBaseURL: 'https://collabogreat.brockchelle.com',
		baseURL: 'https://api.collabogreat.brockchelle.com/api',
		oauth: {
			successRoute: 'https://collabogreat.brockchelle.com/dasboard',
			failureRoute: 'https://collabogreat.brockchelle.com',
		},
		rateLimit: {
			maxRequests: 100,
			timeWindow: 1, // Time in minutes
		},
	},
};
