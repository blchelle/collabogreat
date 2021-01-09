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

		this.router.route('/me').get(this.getMe()).patch(this.updateMe());
		this.router.route('/:email').get(this.findUserByEmail());
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
						'Unable to find your information',
						'Try logging out and logging back in with the same provider'
					)
				);
			}

			// Gets the user and project from the request
			const user = req.user as IUser;

			res.status(StatusCode.SuccessOK).json({ user });
		});
	}

	/**
	 * Gets the users information and sends it in the response
	 */
	protected updateMe() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request object
			// When a user creates a project, it should be added to their document
			if (!req.user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Unable to find your information',
						'Try logging out and logging back in with the same provider'
					)
				);
			}

			// Gets the user and project from the request
			const user = req.user as IUser;

			// Updates the user
			const updatedUser = await this.model.findByIdAndUpdate(user._id, req.body, { new: true });

			res.status(StatusCode.SuccessOK).json({ user: updatedUser });
		});
	}

	protected findUserByEmail() {
		return catchAsync(async (req: Request, res: Response) => {
			// Pulls the email off of the url params
			const { email } = req.params;

			// Searches for a user by their email address
			const user = await this.model.findOne({ email });

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json({ userId: user?.id });
		});
	}
}

export default ProjectController;
