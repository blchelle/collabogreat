/* eslint-disable eqeqeq */
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import UserModel, { IUser } from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';
import ProjectModel from '../models/project.model';
import TaskModel from '../models/task.model';
import logger from '../utils/logger.utils';

/**
 * Used to perform operations relating to the Project Model
 */
class UserController extends Controller {
	public path = 'user';

	public model = UserModel;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		// All routes above this are public
		this.router.use(this.protectRoute());
		// All routes below this are protected

		this.router.route('/me').get(this.getMe());
		this.router.route('/me/accept/:id').patch(this.acceptProjectInvite());
		this.router.route('/me/reject/:id').patch(this.rejectProjectInvite());
		this.router.route('/me/leave/:id').patch(this.leaveProject());
		this.router.route('/me/dismiss/:id').patch(this.dismissNewTask());
		this.router.route('/:email').get(this.findUserByEmail());
		this.router.route('/invite').patch(this.inviteUserToProject());
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
			logger(
				'USER CONTROLLER',
				`User '${user.displayName ?? 'unknown'}' (${user.id ?? 'unknown'}) fetched their account.`
			);

			res.status(StatusCode.SuccessOK).json({ user });
		});
	}

	protected findUserByEmail() {
		return catchAsync(async (req: Request, res: Response) => {
			// Pulls the email off of the url params
			const { email } = req.params;

			// Searches for a user by their email address
			const user = await this.model.findOne({ email });

			const reqUser = req.user as IUser;
			logger(
				'USER CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				}) searched for user ${email} and found ${user?.id ?? 'nothing'} `
			);

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json({ userId: user?.id });
		});
	}

	protected inviteUserToProject() {
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

			const reqUser = req.user as IUser;

			if (reqUser.isDemo) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Demo Users are not allowed to invite other users to a project',
						'Sign up for CollaboGreat if you wish to try this out'
					)
				);
			}

			// Pulls the userId and projectId off of the body of the request
			const { userId, projectId } = req.body;

			if (reqUser._id == userId) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Nice try bucko...',
						'You cannot invite yourself to a project'
					)
				);
			}

			// Ensures that the user doesn't have an existing invitation to the project
			const userHasInviteToProject =
				(await this.model.findOne({ _id: userId, projectInvitations: projectId })) !== null;
			if (userHasInviteToProject) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'This user already has an invitation to the project',
						'Wait for them to accept or decline their current invitation'
					)
				);
			}

			// Ensures that the user doesn't have an existing invitation to the project
			const userIsAlreadyMember =
				(await this.model.findOne({ _id: userId, projects: projectId })) !== null;
			if (userIsAlreadyMember) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'This user is already a member of the project',
						''
					)
				);
			}

			// Pushes the project id onto the users projectInvitations
			await this.model.findByIdAndUpdate(userId, {
				$push: { projectInvitations: projectId },
			});

			logger(
				'USER CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				}) invited user '${userId}' to project '${projectId}'`
			);

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json();
		});
	}

	protected leaveProject() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request object
			if (!req.user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Unable to find your information',
						'Try logging out and logging back in with the same provider'
					)
				);
			}

			const reqUser = req.user as IUser;

			// Demo users cannot leave project because it could lead to an impossible cleanup later
			if (reqUser.isDemo) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Demo Users are not allowed to leave a project',
						'Sign up for CollaboGreat if you wish to try this out'
					)
				);
			}

			// Pulls the id of the user
			const userId = reqUser.id;

			// Ensures that the user is trying to leave a rel project
			const projectId = req.params.id;
			if (!(await ProjectModel.findById(projectId))) {
				return next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						`Unable to find a project with id ${projectId}`,
						'Ensure that the project you are trying to leave has not been deleted'
					)
				);
			}

			// Ensures that the user doesn't have any tasks left to do in the project
			const tasks = await TaskModel.find({ $and: [{ user: userId }, { project: projectId }] });
			if (tasks.length > 0) {
				return next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						'Unable to leave project',
						'You must transfer ownership or delete any outstanding tasks you have in this project'
					)
				);
			}

			// Uses a transaction to ensure that all operations are successful
			const session = await mongoose.startSession();
			session.startTransaction();

			// Removes the project from the users 'projects' attribute
			const user = await UserModel.findByIdAndUpdate(userId, { $pull: { projects: projectId } });

			// Removes the user from the projects 'members' attribute
			await ProjectModel.findByIdAndUpdate(projectId, { $pull: { members: userId } });

			await session.commitTransaction();
			session.endSession();

			logger(
				'USER CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				}) left project ${projectId}`
			);

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json({ user });
		});
	}

	protected acceptProjectInvite() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Pulls the id of the user and project off of the request
			const user = req.user as IUser;
			const projectId = req.params.id;

			// Ensures that the user is trying to join a real project
			if (!(await ProjectModel.findById(projectId))) {
				return next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						`Unable to find a project with id ${projectId}`,
						'Ensure that the project you are trying to join has not been deleted'
					)
				);
			}

			// Ensures that the user has an invite
			user.depopulate('projectInvitations');
			if (!user.projectInvitations.includes(projectId)) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Unable to accept an invitation to a project you are not invited to',
						'Try getting an invite from the project first'
					)
				);
			}

			// Uses a transaction to ensure that all operations are successful
			const session = await mongoose.startSession();
			session.startTransaction();

			// Moves the project id from 'projectInvitations' to 'projects' on the user
			const updatedUser = await UserModel.findByIdAndUpdate(
				user.id,
				{
					$pull: { projectInvitations: projectId },
					$push: { projects: projectId },
				},
				{ session, new: true }
			);

			// Adds the userId to the project members
			const updatedProject = await ProjectModel.findByIdAndUpdate(
				projectId,
				{ $push: { members: user.id } },
				{ session, new: true }
			);

			// Commits and finalizes the transaction
			await session.commitTransaction();
			session.endSession();

			logger(
				'USER CONTROLLER',
				`User '${user.displayName ?? 'unknown'}' (${
					user.id ?? 'unknown'
				}) joined project ${projectId}`
			);

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json({ user: updatedUser, project: updatedProject });
		});
	}

	protected rejectProjectInvite() {
		return catchAsync(async (req: Request, res: Response) => {
			// Pulls the id of the user and project off of the request
			const user = req.user as IUser;
			const projectId = req.params.id;

			// Removes the project id from 'projectInvitations'
			const updatedUser = await UserModel.findByIdAndUpdate(
				user.id,
				{
					$pull: { projectInvitations: projectId },
				},
				{ new: true }
			);

			logger(
				'USER CONTROLLER',
				`User '${user.displayName ?? 'unknown'}' (${
					user.id ?? 'unknown'
				}) rejected project invitation to ${projectId}`
			);

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json({ user: updatedUser });
		});
	}

	protected dismissNewTask() {
		return catchAsync(async (req: Request, res: Response) => {
			// Pulls the id of the user and project off of the request
			const user = req.user as IUser;
			const taskId = req.params.id;

			// Removes the project id from 'newTasks'
			const updatedUser = await UserModel.findByIdAndUpdate(
				user.id,
				{
					$pull: { newTasks: taskId },
				},
				{ new: true }
			);

			logger(
				'USER CONTROLLER',
				`User '${user.displayName ?? 'unknown'}' (${
					user.id ?? 'unknown'
				}) dismissed notification for task '${taskId}'`
			);

			// Sends the users id back in the request
			res.status(StatusCode.SuccessOK).json({ user: updatedUser });
		});
	}
}

export default UserController;
