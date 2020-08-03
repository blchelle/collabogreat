import App from './app';
import AuthController from './controllers/auth.controller';
import ProjectController from './controllers/project.controller';

// Listen for uncaught exceptions and end the process when they occure
process.on('uncaughtException', (err: Error) => {
	console.error('UNCAUGHT EXCEPTION');
	console.log(err.name, err.message);
	console.log(err.stack);

	process.exit(1);
});

// Create an app instance
const app = new App([new ProjectController(), new AuthController()]);

// Start the Server
const server = app.listen();

// Listen for unhandled rejections and close the server when they occur
process.on('unhandledRejection', (err: Error) => {
	console.error('UNHANDLED REJECTION');
	console.log(err.name, err.message);
	server.close(() => console.log('Server closed gracefully'));
});
