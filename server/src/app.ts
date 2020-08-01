/* eslint-disable no-console */
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import Controller from './controllers/Controller';
import keys from './config/keys.config';
import environment from './config/environment.config';

class App {
	public app: Application;

	public port = environment.development.port;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.app.use(express.json());

		// Note: It is important that the middlewares are initialized before
		// the controllers so that they appear first in the middleware stack
		this.initMiddlewares();
		this.initControllers(controllers);
	}

	private initControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use(
				`/api/v${environment.development.version}/${controller.path}`,
				controller.router
			);
		});
	}

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
	}

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

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}...`);
		});
	}
}

export default App;
