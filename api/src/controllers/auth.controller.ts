import { Request, Response, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import passport, { AuthenticateOptions } from 'passport';

import StatusCode from 'status-code-enum';
import environment from '../configs/environment.config';
import keys from '../configs/keys.config';
import RegisteredOAuthProvider from '../configs/passport.config';
import Controller from './base.controller';
import User, { IUser } from '../models/user.model';
import logger from '../utils/logger.utils';

/**
 * Used to handle various authentication tasks such as logging in and signing up with
 * OAuth Provider, and logging out
 */
class AuthController extends Controller {
	public path = 'auth';

	public model = User;

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

		this.router.route('/logout').get(this.logout);
	}

	/**
	 * Redirects the user to the authentication page for the given provider
	 * @param provider The provider to login with
	 * @param options Options for the provider (Is it session based? What permissions?)
	 */
	private loginWithProvider(provider: RegisteredOAuthProvider, options: AuthenticateOptions) {
		return passport.authenticate(provider, options);
	}

	/**
	 * Authenticates the user with the provider they selected to authenticate with
	 * @param provider The provider to authenticate with
	 */
	private redirectProvider(provider: RegisteredOAuthProvider) {
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
			secure: process.env.NODE_ENV === 'production'
		};

		// Sends the cookie and redirects the client to the dashboard
		res.cookie('Bearer', token, cookieOptions);
		res.redirect(environment[process.env.NODE_ENV as 'development' | 'production'].oauth.successRoute);
	}

	/**
	 * Sends the user a blank http only cookie with a short life
	 * @param req Incoming request
	 * @param res Outgoing response
	 */
	private logout(_req: Request, res: Response) {
		res.cookie('Bearer', 'loggedout', {
			maxAge: 10 * 1000, // 10 Seconds
			httpOnly: true,
		});

		res.status(StatusCode.SuccessOK).json({ success: true });
	}
}

export default AuthController;
