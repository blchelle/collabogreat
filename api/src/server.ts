import App from './app';
import AuthController from './controllers/auth.controller';
import ProjectController from './controllers/project.controller';
import logger from './utils/logger.utils';

// Importing this automatically executes the file
import './configs/passport.config';

// Listen for uncaught exceptions and end the process when they occure
process.on('uncaughtException', (err: Error) => {
	logger('SERVER', 'UNCAUGHT EXCEPTION ❌');
	logger('SERVER', err.message);

	if (err.stack) logger('SERVER', err.stack);

	process.exit(1);
});

// Create an app instance
const app = new App([new ProjectController(), new AuthController()]);

// Start the Server
const server = app.listen();

// Listen for unhandled rejections and close the server when they occur
process.on('unhandledRejection', (err: Error) => {
	logger('SERVER', 'UNHANDLED REJECTION ❌');
	logger('SERVER', err.message);
	server.close(() => logger('SERVER', 'Server closed gracefully'));
});
