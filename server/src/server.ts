/* eslint-disable no-console */
import path from 'path';
import dotenv from 'dotenv';
import App from './app';
import ProjectController from './controllers/projectController';

process.on('uncaughtException', (error) => {
	console.error('UNCAUGHT EXCEPTION');
	console.log(error.name, error.message);
	console.log(error.stack);

	process.exit(1);
});

// Read the configuration file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Verify the port number
const port = Number(process.env.PORT) || 8000;
const app = new App([ProjectController.getInstance()], port);

// Pull and verify MongoDB credentials
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
	throw new Error('Database access credentials are not supplies');
}

// Connect to MongoDB
const database = process.env.DATABASE;
const databasePassword = process.env.DATABASE_PASSWORD;
const db = database.replace('<PASSWORD>', databasePassword);
App.connectToMongoDB(db);

// Start the Server
app.listen();
