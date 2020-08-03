import App from './app';
import ProjectController from './controllers/project.controller';
import AuthController from './controllers/auth.controller';

process.on('uncaughtException', (error) => {
	console.error('UNCAUGHT EXCEPTION');
	console.log(error.name, error.message);
	console.log(error.stack);

	process.exit(1);
});

// Create an app instance
const app = new App([new ProjectController(), new AuthController()]);

// Start the Server
const server = app.listen();

process.on('unhandledRejection', (err: Error) => {
	console.error('UNHANDLED REJECTION');
	console.log(err.name, err.message);
	server.close(() => console.log('Server closed gracefully'));
});
