import App from './app';
import AuthController from './controllers/auth.controller';
import DemoController from './controllers/demo.controller';
import ProjectController from './controllers/project.controller';
import TaskController from './controllers/task.controller';
import UserController from './controllers/user.controller';
import logger from './utils/logger.utils';

// Initializes the OAuth strategies for each of the registered providers
import './configs/passport.config';

// Listens for uncaught exceptions and end the process when they occur
process.on('uncaughtException', (err: Error) => {
	logger('SERVER', 'UNCAUGHT EXCEPTION ❌');
	logger('SERVER', err.message);

	if (err.stack) logger('SERVER', err.stack);

	process.exit(1);
});

// Creates an app instance
const app = new App([
	new ProjectController(),
	new UserController(),
	new AuthController(),
	new TaskController(),
	new DemoController(),
]);

// Starts the Server
const server = app.listen();

// Listens for unhandled rejections and close the server when they occur
process.on('unhandledRejection', (err: Error) => {
	logger('SERVER', 'UNHANDLED REJECTION ❌');
	logger('SERVER', err.message);
	server.close(() => logger('SERVER', 'Server closed gracefully'));
});
