export default {
	development: {
		version: 0,
		port: 8000,
		devClientBaseURL: 'http://localhost:3000',
		oauth: {
			successRoute: 'http://localhost:3000/dashboard',
			failureRoute: 'http://localhost:3000',
		},
		rateLimit: {
			maxRequests: 100,
			timeWindow: 1, // Time in minutes
		},
	},
};
