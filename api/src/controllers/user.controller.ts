import { NextFunction, Request, Response } from 'express';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import User, { IUser } from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';

/**
 * Used to perform operations relating to the Project Model
 */
class ProjectController extends Controller {
	public path = 'user';

	public model = User;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		// All routes above this are public
		this.router.use(this.protectRoute());
		// All routes below this are protected

		this.router.route('/me').get(this.getMe());
	}

	/**
	 * Gets the users information and sends it in the response
	 */
	protected getMe() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request object
			// When a user creates a project, it should be added to their document
			if (!req.user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Attempted to create a Project without a User'
					)
				);
			}

			// Gets the user and project from the request
			const user = req.user as IUser;

			res.status(StatusCode.SuccessOK).json({ user });
		});
	}
}

export default ProjectController;