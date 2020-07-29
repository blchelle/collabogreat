/* eslint-disable no-console */
import path from 'path';
import dotenv from 'dotenv';
import App from './app';
import ProjectController from './controllers/projectController';
import AuthController from './controllers/authController';
import keys from './config/keys';
import './config/passport.config';

process.on('uncaughtException', (error) => {
	console.error('UNCAUGHT EXCEPTION');
	console.log(error.name, error.message);
	console.log(error.stack);

	process.exit(1);
});

// Read the configuration file
dotenv.config({ path: path.resolve(__dirname, '../server.env') });

// Verify the port number
const port = Number(process.env.PORT) || 8000;
const app = new App([new ProjectController(), new AuthController()], port);

// Connect to MongoDB
const { database } = keys.mongoDB;
const { databasePassword } = keys.mongoDB;
const db = database.replace('<PASSWORD>', databasePassword);
App.connectToMongoDB(db);

// Start the Server
app.listen();
