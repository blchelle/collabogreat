/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import passport, { AuthenticateOptions } from 'passport';
import { StatusCode } from 'status-code-enum';
import environment from '../config/environment.config';
import Controller from './Controller';

class AuthController extends Controller {
	public path = 'auth';

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router
			.route('/google')
			.get(this.loginWithProvider('google', { scope: ['profile', 'email'] }));
		this.router
			.route('/facebook')
			.get(this.loginWithProvider('facebook', { scope: ['email', 'user_photos'] }));
		this.router.route('/github').get(this.loginWithProvider('github', { scope: ['user:email'] }));

		this.router.route('/google/redirect').get(this.redirectProvider('google'));
		this.router.route('/facebook/redirect').get(this.redirectProvider('facebook'));
		this.router.route('/github/redirect').get(this.redirectProvider('github'));

		this.router.route('/login/success').get(this.loginSuccess);
		this.router.route('/login/failed').get(this.loginFailed);
		this.router.route('/logout').get(this.logout);
	}

	private loginWithProvider(providerName: string, options: AuthenticateOptions) {
		return passport.authenticate(providerName, options);
	}

	private redirectProvider(providerName: string) {
		return passport.authenticate(providerName, {
			successRedirect: environment.development.oauth.successRoute,
			failureRedirect: environment.development.oauth.failureRoute,
		});
	}

	private logout(req: Request, res: Response) {
		req.logout();
		res.send(req.user);
	}

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

	private loginFailed(_: Request, res: Response) {
		res.status(StatusCode.ClientErrorUnauthorized).json({
			success: false,
			message: 'User failed to authenticate.',
		});
	}
}

export default AuthController;
