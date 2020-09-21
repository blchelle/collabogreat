import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import StatusCode from 'status-code-enum';

import environment from './configs/environment.config';
import keys from './configs/keys.config';
import Controller from './controllers/base.controller';
import APIError from './errors/api.error';
import errorMiddleware from './middleware/error.middleware';
import logger from './utils/logger.utils';

/**
 * Initializes middleware and controllers for the application
 */
class App {
	/**
	 * The current instance of the application
	 */
	public app: Application;

	/**
	 * The port number which the server will run on
	 */
	public port = environment.development.port;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.app.use(express.json());

		// Connects to the MongoDB database
		this.connectToMongoDB();

		// It is important that the middlewares are initialized before
		// the controllers so that they appear first in the middleware stack
		this.initMiddlewares();
		this.initControllers(controllers);
		this.initErrorHandling();
	}

	/**
	 * Initializes all the controllers of the application
	 * @param controllers All the controllers which will be used for the application
	 */
	private initControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use(
				`/api/v${environment.development.version}/${controller.path}`,
				controller.router
			);
		});
	}

	/**
	 * Initializes all the middleware used in the application
	 */
	private initMiddlewares() {
		// Morgan Middleware
		if (process.env.NODE_ENV === 'development') this.app.use(morgan('dev'));

		// Body Parser Middleware
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));

		// Cookie Parser Middleware
		this.app.use(cookieParser());

		// CORS Middleware
		this.app.use(
			cors({
				credentials: true,
				origin: environment.development.devClientBaseURL,
			})
		);

		// Passport Middleware
		this.app.use(passport.initialize());
	}

	/**
	 * Initializes the middleware that will be used to handle http errors
	 * This middleware has to be placed at the end of the middleware stack,
	 * which is why it is called after all other middlewares
	 */
	private initErrorHandling() {
		// Handles the case where the route is not found
		this.app.all('*', (req, _res, next) =>
			next(
				new APIError(
					StatusCode.ClientErrorNotFound,
					`URL ${req.originalUrl} does not exist on this server`,
					'Try accessing one of our implemented routes'
				)
			)
		);

		// Handles errors thrown from other middlewares
		this.app.use(errorMiddleware);
	}

	/**
	 * Connects the application to the MongoDB database
	 */
	private async connectToMongoDB() {
		// Gets the credentials needed to access the database
		const { database } = keys.mongoDB;
		const { databasePassword } = keys.mongoDB;
		const db = database.replace('<PASSWORD>', databasePassword);

		try {
			await mongoose.connect(db, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			});

			logger('APP', 'Successfully connected to MongoDB ✅');
		} catch (err) {
			logger('APP', 'Failed to connect to MongoDB ❌');
		}
	}

	/**
	 * Starts the server and begins listening for requests on the servers port
	 * @returns The server which was started
	 */
	public listen() {
		return this.app.listen(this.port, () => {
			logger('APP', `Server running on port ${this.port} ✅`);
		});
	}
}

export default App;
