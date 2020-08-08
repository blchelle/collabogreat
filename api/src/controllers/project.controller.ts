import { NextFunction, Request, Response } from 'express';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import Project from '../models/project.model';
import { IUser } from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';

/**
 * Used to perform operations relating to the Project Model
 */
class ProjectController extends Controller {
	public path = 'projects';

	public model = Project;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		// All routes above this are public
		this.router.use(this.protectRoute());
		// All routes below this are protected

		this.router.route('/').get(this.getAll()).post(this.createProject());
		this.router.route('/:id').get(this.getOneById()).delete(this.deleteOneById());
	}

	/**
	 * Creates a project.
	 * The user attached to the request object will be automatically added to this project
	 *
	 * // TODO: When a user invites other users to the project during its creation...
	 * The invited user will still be added to the project, but they will have a status of 'invited'
	 * Joined users will have a status of 'joined'
	 */
	protected createProject() {
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
			const reqUser = req.user as IUser;
			const reqProject = new Project(req.body);

			// User document references the project document
			// Project document references the user document
			reqUser.projects.push(reqProject.id);
			reqProject.members.push(reqUser.id);

			const [user, project] = await Promise.all([reqUser.save(), reqProject.save()]);

			res.status(StatusCode.SuccessCreated).json({ user, project });
		});
	}
}

export default ProjectController;
