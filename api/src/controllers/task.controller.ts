import { NextFunction, Request, Response } from 'express';
import StatusCode from 'status-code-enum';

import Controller from './base.controller';
import APIError from '../errors/api.error';
import Task from '../models/task.model';
import { IUser } from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';

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

		this.router.route('/').post(this.createTask());
		this.router.route('/me').get(this.getTasksForMe());
		this.router.route('/project/:id').get(this.getTasksForProject());
		this.router.route('/user/:id').get(this.getTasksForUser());
	}

	protected createTask() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Pulls the task project id and status from the request
			const { project, status } = req.body;
			let taskOrder;

			if (project && status) {
				// Gets all the tasks with the same project and status
				const similarTasks = await this.model.find({ $and: [{ project }, { status }] });

				// Pulls the maximun order from the list of tasks
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

			res.status(StatusCode.SuccessCreated).json({
				success: true,
				task,
			});
		});
	}

	protected getTasksForMe() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Ensures that the user is on the request object
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

			const tasks = await this.model.find({ user: reqUser.id });

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

			res.status(StatusCode.SuccessOK).json({
				success: true,
				tasks,
			});
		});
	}
}

export default TaskController;
