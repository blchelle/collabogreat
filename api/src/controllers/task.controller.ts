import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import Task, { ITask } from '../models/task.model';
import UserModel, { IUser } from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';
import logger from '../utils/logger.utils';
import ProjectModel from '../models/project.model';

/**
 * Used to perform operations relating to the Project Model
 */
class TaskController extends Controller {
	public path = 'tasks';

	public model = Task;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		// All routes above this are public
		this.router.use(this.protectRoute());
		// All routes below this are protected

		// These two routes are accessible to anyone with an account
		this.router.route('/').post(this.createTask());
		this.router.route('/me').get(this.getTasksForMe());

		// These routes can only be accessed if the user has access to the task
		this.router
			.route('/:id')
			.all(this.checkUserCanAccessTask())
			.get(this.getOneById())
			.delete(this.deleteOneById());

		// These routes can only be accessed if the user has access to the project which
		// the tasks belong to
		this.router
			.route('/project/:id')
			.all(this.checkUserInProject())
			.get(this.getTasksForProject())
			.patch(this.patchProjectTasks());
	}

	protected createTask() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request
			if (!req.user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Attempted to create a Task without a user',
						'Try adding yourself to the next task you create'
					)
				);
			}

			// Pulls the task project id and status from the request
			const { project, status, user } = req.body;
			let taskOrder;

			if (project && status) {
				// Gets all the tasks with the same project and status
				const similarTasks = await this.model.find({ $and: [{ project }, { status }] });

				// Pulls the maximum order from the list of tasks
				taskOrder = Object.values(similarTasks).length;
			} else {
				return next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						'Attempted to create a task without a status or linked project',
						'Try giving your task both a project and a status'
					)
				);
			}

			const task = await this.model.create({ ...req.body, order: taskOrder });

			// If the task was assigned to someone other than the creator, send that person a new task notification
			const reqUser = req.user as IUser;
			if (reqUser.id !== user) {
				// Update the user
				await UserModel.findByIdAndUpdate(user, { $push: { newTasks: task.id } });
			}

			logger(
				'TASK CONTROLLER',
				`User '${reqUser.displayName}' (${reqUser.id}) created task '${task.id}.'`
			);

			res.status(StatusCode.SuccessCreated).json({
				success: true,
				task,
			});
		});
	}

	protected patchProjectTasks() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			const reqTasks = req.body.tasks as ITask[];

			// Throws if the request didn't have a tasks attribute in the body
			if (!reqTasks) {
				next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						"No field 'tasks' was given in the body of the request",
						"Make sure the body of your request has a 'tasks' field"
					)
				);
			}

			// Uses a transaction to ensure that all patches are successful
			const session = await mongoose.startSession();
			session.startTransaction();

			const resTasks = await Promise.all(
				reqTasks.map(async (task) => {
					await this.model.findByIdAndUpdate(task._id, task);
					return task;
				})
			);

			// Commits the transaction and ends the session
			await session.commitTransaction();
			session.endSession();

			const reqUser = req.user as IUser;
			logger(
				'TASK CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				}) patched multiple tasks.`
			);

			res.status(StatusCode.SuccessOK).json({ tasks: resTasks });
		});
	}

	protected getTasksForMe() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request object
			if (!req.user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'Attempted to get tasks for an unknown user',
						'Try logging out and then logging back in'
					)
				);
			}

			const reqUser = req.user as IUser;

			const tasks = await this.model.find({ user: reqUser.id });

			logger(
				'TASK CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				} fetched all the tasks assigned to them.`
			);

			res.status(StatusCode.SuccessOK).json({
				success: true,
				tasks,
			});
		});
	}

	protected getTasksForProject() {
		return catchAsync(async (req: Request, res: Response) => {
			const reqProjectId = req.params.id;

			const tasks = await this.model.find({ project: reqProjectId });

			const reqUser = req.user as IUser;
			logger(
				'TASK CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				} fetched all the tasks for project ${reqProjectId}.`
			);

			res.status(StatusCode.SuccessOK).json({
				success: true,
				tasks,
			});
		});
	}

	protected getTasksForUser() {
		return catchAsync(async (req: Request, res: Response) => {
			const reqUserId = req.params.id;

			const tasks = await this.model.find({ user: reqUserId });

			const reqUser = req.user as IUser;
			logger(
				'TASK CONTROLLER',
				`User '${reqUser.displayName ?? 'unknown'}' (${
					reqUser.id ?? 'unknown'
				} fetched all the tasks for user ${reqUserId}.`
			);

			res.status(StatusCode.SuccessOK).json({
				success: true,
				tasks,
			});
		});
	}

	private checkUserCanAccessTask() {
		return catchAsync(async (req: Request, _: Response, next: NextFunction) => {
			// Users can only access a task if either is true
			// 1. They are assigned to the task ()
			// 2. The task is part of one of the projects that the user belongs to

			// Pulls the task and user id off of the request
			const userId = (req.user as IUser).id;
			const taskId = req.params.id;

			// Gets the project for the task
			const task = await this.model.findById(taskId);

			if (!task) {
				return next(
					new APIError(
						StatusCode.ClientErrorNotFound,
						"We couldn't find that task",
						'Double check the id of the task and confirm it is correct'
					)
				);
			}

			// If the user is assigned to the task then we can confirm early
			if (task.user === userId) {
				return next();
			}

			// Check if the user is a member of the tasks assigned project
			const userInProject = ProjectModel.find({ _id: task.project, members: userId });
			if (!userInProject) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'You are not authorized to perform this operation.',
						"To perform this operation, you must be a member of the task's project."
					)
				);
			}

			// Everything was successful, Move to the next stage
			next();
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
			const userInProject =
				(await ProjectModel.find({ _id: projectId, members: userId })).length > 0;

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

export default TaskController;
