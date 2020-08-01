/* eslint-disable no-console */
import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import Controller from './controllers/Controller';
import environment from './config/environment.config';
import { configureProviderStrategy, RegisteredOAuthProvider } from './config/passport.config';
import keys from './config/keys.config';

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

		// Note: It is important that the middlewares are initialized before
		// the controllers so that they appear first in the middleware stack
		this.initMiddlewares();
		this.initControllers(controllers);
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

		// CORS Middleware
		this.app.use(
			cors({
				origin: environment.development.devClientBaseURL,
				methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
				credentials: true, // Allow a session cookie from browser to pass through
			})
		);

		this.app.use(
			cookieSession({
				keys: [keys.session.cookieKey],
				maxAge: 24 * 60 * 60 * 100,
			})
		);

		// Cookie Parsing Middleware
		this.app.use(cookieParser());

		// Passport Middleware
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		// Passport Provider Setup
		configureProviderStrategy(RegisteredOAuthProvider.FACEBOOK);
		configureProviderStrategy(RegisteredOAuthProvider.GOOGLE);
		configureProviderStrategy(RegisteredOAuthProvider.GITHUB);
	}

	/**
	 * Connects the application to the MongoDB database
	 * @param db The database string used to connect to the database
	 */
	static connectToMongoDB(db: string) {
		mongoose
			.connect(db, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			})
			.then(() => console.log('Connected to DB'))
			.catch(() => console.error('Failed to connect to DB'));
	}

	/**
	 * Starts the server and begins listening for requests on the servers port
	 */
	public listen() {
		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}...`);
		});
	}
}

export default App;
