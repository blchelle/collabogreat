export default {
	development: {
		version: 0,
		port: 8000,
		clientBaseURL: 'http://localhost:3000',
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
		oauth: {
			successRoute: 'https://collabogreat.brockchelle.com',
			failureRoute: 'https://collabogreat.brockchelle.com',
		},
		rateLimit: {
			maxRequests: 100,
			timeWindow: 1, // Time in minutes
		},
	}
};
