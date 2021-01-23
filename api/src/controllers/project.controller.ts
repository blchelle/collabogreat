import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import Project from '../models/project.model';
import UserModel, { IUser } from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';
import logger from '../utils/logger.utils';

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
		this.router.use(this.protectRoute());
		// Users must be authenticated to access routes below this comment

		this.router.route('/').get(this.getAll()).post(this.createProject());

		// Users must be part of the project with the specified id to access these routes
		this.router
			.route('/:id')
			.all(this.checkUserInProject())
			.get(this.getOneById())
			.delete(this.deleteOneById())
			.patch(this.patchOneById());
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

			// Only real users can invite members to a project
			if (reqMembers.length > 0 && reqUser.isDemo) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Demo Users are not allowed to invite other users to a project',
						'Sign up for CollaboGreat if you wish to try this out'
					)
				);
			}

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

			// Logs the creation
			logger(
				'PROJECT CONTROLLER',
				`Project '${reqProject.id}' is being created by user '${reqUser.displayName}' (${reqUser._id})`
			);

			res.status(StatusCode.SuccessCreated).json({ project });
		});
	}

	private checkUserInProject() {
		return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
			// Checks if the user belongs to the project attempted to be patched
			const userId = (req.user as IUser).id;
			const projectId = req.params.id;

			// Queries for the number of projects with the passed in id and has the requesting
			// user listed as one of its members
			//
			// If there are no results for this query, that implies that the user is not
			// a member of the project and should not be authorized to perform this action
			const userInProject = (await this.model.find({ _id: projectId, members: userId })).length > 0;

			// Error case if the user is not part of the project they're trying to edit
			if (!userInProject) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'You are not authorized to perform this operation.',
						'To perform this operation, you must be a member of the project.'
					)
				);
			}

			// Everything was successful, Move to the next stage
			next();
		});
	}
}

export default ProjectController;
