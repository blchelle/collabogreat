import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import Project from '../models/project.model';
import UserModel, { IUser } from '../models/user.model';
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

		this.router.route('/').get(this.getAll()).post(this.createProject()).patch(this.patchOne());
		this.router.route('/:id').get(this.getOneById()).delete(this.deleteOneById());
	}

	/**
	 * Creates a project.
	 * The user attached to the request object will be automatically added to this project
	 */
	protected createProject() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request object
			// When a user creates a project, it should be added to their document
			if (!req.user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Attempted to create a Project without a User',
						'Try adding yourself to the next Project you create'
					)
				);
			}

			// Gets the user and project from the request
			const reqUser = req.user as IUser;
			const reqProject = new Project(req.body);

			// Gets the other members from the request
			const reqMembers = reqProject.members;

			// User document references the project &
			// Project document references the user
			// Clears all members from the project, except the creating user
			reqProject.members = [reqUser.id];
			reqUser.projects.push(reqProject.id);

			// Uses a transaction to ensure that all operations are successful
			const session = await mongoose.startSession();
			session.startTransaction();

			// Attempts to add a project invitation to all the members who were invited
			await Promise.all(
				reqMembers.map(async (memberId) => {
					return UserModel.findByIdAndUpdate(memberId, {
						$push: { projectInvitations: reqProject.id },
					});
				})
			);

			// Attempts to save the new project and the updated user
			const project = await reqProject.save({ session });
			await reqUser.save({ session });

			await session.commitTransaction();
			session.endSession();

			res.status(StatusCode.SuccessCreated).json({ project });
		});
	}
}

export default ProjectController;
