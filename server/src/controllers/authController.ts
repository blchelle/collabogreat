/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import passport, { AuthenticateOptions } from 'passport';
import { StatusCode } from 'status-code-enum';
import Controller from './Controller';
import environment from '../config/environment.config';
import { RegisteredOAuthProvider } from '../config/passport.config';

/**
 * A controller used to handle various authentication tasks such as logging in and signing up with
 * OAuth Provider, and logging out
 */
class AuthController extends Controller {
	public path = 'auth';

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		// Setup Login Handlers for the available providers
		this.router
			.route('/google')
			.get(this.loginWithProvider(RegisteredOAuthProvider.GOOGLE, { scope: ['profile', 'email'] }));
		this.router.route('/facebook').get(
			this.loginWithProvider(RegisteredOAuthProvider.FACEBOOK, {
				scope: ['email', 'user_photos'],
			})
		);
		this.router
			.route('/github')
			.get(this.loginWithProvider(RegisteredOAuthProvider.GITHUB, { scope: ['user:email'] }));

		// Setup Login Redirect Handlers for the available providers
		this.router
			.route('/google/redirect')
			.get(this.redirectProvider(RegisteredOAuthProvider.GOOGLE));
		this.router
			.route('/facebook/redirect')
			.get(this.redirectProvider(RegisteredOAuthProvider.FACEBOOK));
		this.router
			.route('/github/redirect')
			.get(this.redirectProvider(RegisteredOAuthProvider.GITHUB));

		// Setup failure and success routes for logins
		this.router.route('/login/success').get(this.loginSuccess);
		this.router.route('/login/failed').get(this.loginFailed);

		// Setup a logout route
		this.router.route('/logout').get(this.logout);
	}

	/**
	 * Redirects the user to the authentication page for the given provider
	 * @param providerName The provider which will be used to login
	 * @param options Options given to authenticate such as which permissions to ask for
	 */
	private loginWithProvider(providerName: RegisteredOAuthProvider, options: AuthenticateOptions) {
		return passport.authenticate(providerName, options);
	}

	/**
	 * Authenticates the user with the provider they selected to authenticate with
	 * @param providerName The provider to authenticate with
	 */
	private redirectProvider(providerName: RegisteredOAuthProvider) {
		return passport.authenticate(providerName, {
			successRedirect: environment.development.oauth.successRoute,
			failureRedirect: environment.development.oauth.failureRoute,
		});
	}

	/**
	 * Logsout the user and sends their blank information as a response
	 * @param req Incoming request
	 * @param res Outgoing response
	 */
	private logout(req: Request, res: Response) {
		req.logout();
		res.send(req.user);
	}

	/**
	 * Sends the users credentials back to them when they successfully authenticate with a provider
	 * @param req Incoming request
	 * @param res Outgoing response
	 */
	private loginSuccess(req: Request, res: Response) {
		if (req.user) {
			res.json({
				success: true,
				message: 'User has successfully authenticated',
				user: req.user,
				cookies: req.cookies,
			});
		}
	}

	/**
	 * Sends a failure message back to the user who failed to login with a provider
	 * @param _ Incoming request, UNUSED
	 * @param res Outgoing response
	 */
	private loginFailed(_: Request, res: Response) {
		res.status(StatusCode.ClientErrorUnauthorized).json({
			success: false,
			message: 'User failed to authenticate.',
		});
	}
}

export default AuthController;
