import { Request, Response, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import passport, { AuthenticateOptions } from 'passport';

import environment from '../configs/environment.config';
import keys from '../configs/keys.config';
import RegisteredOAuthProvider from '../configs/passport.config';
import Controller from './base.controller';
import User, { IUser } from '../models/user.model';

/**
 * A controller used to handle various authentication tasks such as logging in and signing up with
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
		// Setup Login and Redirect Handlers for the available providers
		Object.values(RegisteredOAuthProvider).forEach((provider) => {
			this.router
				.route(`/${provider}`)
				.get(this.loginWithProvider(provider, { scope: keys[provider].scope }));

			this.router
				.route(`/${provider}/redirect`)
				.get(this.redirectProvider(provider), this.createAndSendToken);
		});

		// Setup a logout route
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
			expires: new Date(Date.now() + keys.jwt.cookieLifespan * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		};

		// Sends the cookie and redirects the client to the dashboard
		res.cookie('jwt', token, cookieOptions);
		res.redirect(environment.development.oauth.successRoute);
	}

	/**
	 * Logsout the user and sends their blank information as a response
	 * @param req Incoming reqYeauest
	 * @param res Outgoing response
	 */
	private logout(req: Request, res: Response) {
		req.logout();
		res.send(req.user);
	}
}

export default AuthController;
