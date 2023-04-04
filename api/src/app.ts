import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import StatusCode from 'status-code-enum';

import environment from './configs/environment.config';
import keys from './configs/keys.config';
import Controller from './controllers/base.controller';
import APIError from './errors/api.error';
import errorMiddleware from './middleware/error.middleware';
import logger from './utils/logger.utils';
import { NodeEnv } from './utils/envTypes.util';
import path from 'path';

// Has to be done in a 'require' because there are no type declarations
const xss = require('xss-clean');

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
	public port = environment[process.env.NODE_ENV as NodeEnv].port;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.app.use(express.json());

		// Connects to the MongoDB database
		this.connectToMongoDB();

		// It is important that the middlewares are initialized before
		// the controllers so that they appear first in the middleware stack
		this.initMiddlewares();
		this.initControllers(controllers);

		this.app.use(express.static(path.join(__dirname, '../..', 'client', 'build')));
		this.app.use((_: Request, res: Response) => {
			res.sendFile(path.join(__dirname, '../..', 'client', 'build', 'index.html'));
		});

		this.initErrorHandling();
	}

	/**
	 * Initializes all the controllers of the application
	 * @param controllers All the controllers which will be used for the application
	 */
	private initControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use(
				`/api/v${environment[process.env.NODE_ENV as NodeEnv].version}/${controller.path}`,
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

		// Rate Limits Requests from the same IP
		this.app.use(
			'/api',
			rateLimit({
				max: environment[process.env.NODE_ENV as NodeEnv].rateLimit.maxRequests,
				windowMs: environment[process.env.NODE_ENV as NodeEnv].rateLimit.timeWindow * 1000 * 60,
				message: 'Too many requests from this IP, please try again later',
			})
		);

		this.app.use(
			`/api/v${environment[process.env.NODE_ENV as NodeEnv].version}/demo`,
			rateLimit({
				max: 5,
				windowMs: 1000 * 60 * 60 * 24 * 7, // 1 Week
			})
		);

		// Sets Secure HTTP Headers
		// this.app.use(helmet());

		// Prevents against http parameter pollution attacks
		this.app.use(hpp());

		// Sanitize the data to prevents NoSQL Query Injection
		this.app.use(mongoSanitize());

		// Sanitize the data against XSS
		this.app.use(xss());

		// Cookie Parser Middleware
		this.app.use(cookieParser());

		// CORS Middleware
		this.app.use(
			cors({
				credentials: true,
				origin: environment[process.env.NODE_ENV as NodeEnv].clientBaseURL,
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
		const { databaseName } = keys.mongoDB[process.env.NODE_ENV as NodeEnv];
		const db = database.replace('<PASSWORD>', databasePassword).replace('<DBNAME>', databaseName);

		try {
			await mongoose.connect(db, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			});

			logger('APP', `Connected to database '${databaseName}' ✅`);
		} catch (err) {
			logger('APP', `Failed to connect to database '${databaseName}' ❌`);
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
