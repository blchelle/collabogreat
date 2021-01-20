import { Request, Response, CookieOptions } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import passport, { AuthenticateOptions } from 'passport';

import StatusCode from 'status-code-enum';
import environment from '../configs/environment.config';
import keys from '../configs/keys.config';
import RegisteredOAuthProvider from '../configs/passport.config';
import Controller from './base.controller';
import UserModel, { IUser } from '../models/user.model';
import logger from '../utils/logger.utils';
import TaskModel from '../models/task.model';
import ProjectModel from '../models/project.model';
import catchAsync from '../utils/catchAsync.util';

/**
 * Used to handle various authentication tasks such as logging in and signing up with
 * OAuth Provider, and logging out
 */
class AuthController extends Controller {
	public path = 'auth';

	public model = UserModel;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		// Initializes Login and Redirect Handlers for the available providers
		Object.values(RegisteredOAuthProvider).forEach((provider) => {
			this.router
				.route(`/${provider}`)
				.get(this.loginWithProvider(provider, { scope: keys[provider].scope }));

			this.router
				.route(`/${provider}/redirect`)
				.get(this.redirectProvider(provider), this.createAndSendToken);
		});

		// Protect the logout route
		this.router.use(this.protectRoute());
		this.router.route('/logout').get(this.logout());
	}

	/**
	 * Redirects the user to the authentication page for the given provider
	 * @param provider The provider to login with
	 * @param options Options for the provider (Is it session based? What permissions?)
	 */
	private loginWithProvider(provider: RegisteredOAuthProvider, options: AuthenticateOptions) {
		logger('AUTH CONTROLLER', `Attempting to authenticate with ${provider}`);
		return passport.authenticate(provider, options);
	}

	/**
	 * Authenticates the user with the provider they selected to authenticate with
	 * @param provider The provider to authenticate with
	 */
	private redirectProvider(provider: RegisteredOAuthProvider) {
		logger('AUTH CONTROLLER', `Redirecting to ${provider} OAuth`);
		return passport.authenticate(provider);
	}

	/**
	 * Creates a JWT that will have the the users id signed into it
	 * Then the JWT will be sent in the form of a HTTP-Only secure cookie
	 * @param req The http request
	 * @param res The http response
	 */
	private createAndSendToken(req: Request, res: Response) {
		const user = req.user as IUser;

		// Signs a jwt with the users id
		const token = jwt.sign({ id: user.id }, keys.jwt.secret, {
			expiresIn: keys.jwt.tokenLifeSpan,
		});

		const cookieOptions: CookieOptions = {
			maxAge: keys.jwt.cookieLifespan * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};

		logger('AUTH CONTROLLER', `Sending token for user '${user.id}'`);

		// Sends the cookie and redirects the client to the dashboard
		res
			.cookie('Bearer', token, cookieOptions)
			.redirect(
				environment[process.env.NODE_ENV as 'development' | 'production'].oauth.successRoute
			);
	}

	/**
	 * Sends the user a blank http only cookie with a short life
	 * @param req Incoming request
	 * @param res Outgoing response
	 */
	private logout() {
		return catchAsync(async (req: Request, res: Response) => {
			const reqUser = req.user as IUser;

			// Check if the user is demo
			// Demo user's need to have their environment cleaned up
			if (reqUser.isDemo) {
				await this.cleanupDemo(req.user as IUser);
			}

			logger('AUTH CONTROLLER', `Logging out user '${reqUser.id}'`);

			res
				.cookie('Bearer', 'loggedout', {
					maxAge: 10 * 1000, // 10 Seconds
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
				})
				.status(StatusCode.SuccessOK)
				.json({ success: true });
		});
	}

	private async cleanupDemo(user: IUser) {
		// Gets all the projects associated with the user
		const projectsToDelete = user.projects;

		// Uses a transaction to ensure that all operations are successful
		const session = await mongoose.startSession();
		session.startTransaction();

		// Delete all the Projects
		await ProjectModel.deleteMany({ members: user.id }, { session });

		// Deletes all the Tasks
		await TaskModel.deleteMany({ project: { $in: projectsToDelete } }, { session });

		// Deletes all the Users
		await UserModel.deleteMany({ projects: { $in: projectsToDelete } }, { session });

		// Finalizes the transaction
		await session.commitTransaction();
		session.endSession();

		logger('AUTH CONTROLLER', `Cleaned up demo for '${user._id}'`);
	}
}

export default AuthController;
