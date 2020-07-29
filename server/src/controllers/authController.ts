/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import passport, { AuthenticateOptions } from 'passport';
import Controller from './Controller';

class AuthController extends Controller {
	public path = 'auth';

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router.route('/google').get(this.loginWithProvider('google', { scope: ['profile'] }));
		this.router.route('/facebook').get(this.loginWithProvider('facebook', {}));
		this.router.route('/github').get(this.loginWithProvider('github', { scope: 'user:email' }));
		this.router.route('/google/redirect').get(
			passport.authenticate('google', {
				successRedirect: 'http://localhost:3000/dashboard',
				failureRedirect: 'api/v0/login/failed',
			})
		);
		this.router.route('/facebook/redirect').get(
			passport.authenticate('facebook', {
				successRedirect: 'http://localhost:3000/dashboard',
				failureRedirect: 'api/v0/login/failed',
			})
		);
		this.router.route('/github/redirect').get(
			passport.authenticate('github', {
				successRedirect: 'http://localhost:3000/dashboard',
				failureRedirect: 'api/v0/login/failed',
			})
		);
		this.router.route('/login/success').get(this.loginSuccess);
		this.router.route('/login/failed').get(this.loginFailed);
		this.router.route('/logout').get(this.logout);
	}

	private loginWithProvider(providerName: string, options: AuthenticateOptions) {
		return passport.authenticate(providerName, options);
	}

	private logout(req: Request, res: Response) {
		req.logout();
		res.send(req.user);
	}

	private loginSuccess(req: Request, res: Response) {
		if (req.user) {
			res.json({
				success: true,
				message: 'user has successfully authenticated',
				user: req.user,
				cookies: req.cookies,
			});
		}
	}

	private loginFailed(_: Request, res: Response) {
		res.status(401).json({
			success: false,
			message: 'user failed to authenticate.',
		});
	}
}

export default AuthController;
