/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { CookieOptions, Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import jwt from 'jsonwebtoken';

import keys from '../configs/keys.config';
import environment from '../configs/environment.config';
import Controller from './base.controller';
import people from '../data/people.data';
import catchAsync from '../utils/catchAsync.util';
import logger from '../utils/logger.utils';
import projects from '../data/projects.data';
import tasks from '../data/tasks.data';
import ProjectModel, { IProject } from '../models/project.model';
import UserModel, { IUser } from '../models/user.model';
import TaskModel from '../models/task.model';

const randomEmail = require('random-email');

/**
 * Used to perform operations relating to the Project Model
 */
class DemoController extends Controller {
	public path = 'demo';

	public model = UserModel;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router.route('/').get(this.createDemoEnvironment());
	}

	/**
	 * Step 1. Create a user that the 'demo' user will use, choose randomly from a set of dummy names.
	 * Step 2. Create 5 Dummy Users, choose randomly from a set of dummy names
	 * Step 3. Create 2 Projects, Namely "KeepIt - Item Tracker" and "Boromi - Book Exchange", Send invites to all the dummy users
	 * Step 4. Create 10 Tasks for each project, allocate them as follows (3 to Main user, 1, 2, 2, 1, 1) for
	 *     - "KeepIt - Item Tracker"
	 * 	       * 3 to User 1,
	 *         * 1 to User 2,
	 *         * 2 to User 3,
	 *         * 3 to User 4,
	 *         * 0 to User 5,
	 *         * 1 to User 6,
	 *     - "Boromi - Book Exchange"
	 *         * 1 to User 1,
	 *         * 0 to User 2,
	 *         * 3 to User 3,
	 *         * 2 to User 4,
	 *         * 1 to User 5,
	 *         * 3 to User 6,
	 *  Step 5. Execute CreateAndSendToken from the AuthController for the main demo user
	 */
	protected createDemoEnvironment() {
		return catchAsync(async (_: Request, res: Response) => {
			// Uses a transaction to ensure that all operations are successful
			const session = await mongoose.startSession();
			session.startTransaction();

			// Step 1 & 2. Create user's
			const newUsers = await this.createDemoUsers(session);
			const me = newUsers[0];

			// Step 3 & 4. Creates projects and sends invites
			const newProjects = await this.createDemoProjects([...newUsers], session);

			// Step 5: Set up the demo tasks
			await this.createDemoTasks(newUsers, newProjects, session);

			// Finalizes the transaction
			await session.commitTransaction();
			session.endSession();

			// Step 6. Create, Sign and Send a token
			// Signs a jwt with the users id
			const token = jwt.sign({ id: me.id }, keys.jwt.secret, {
				expiresIn: keys.jwt.tokenLifeSpan,
			});

			const cookieOptions: CookieOptions = {
				maxAge: keys.jwt.cookieLifespan * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			};

			logger('DEMO CONTROLLER', `Created demo for user '${me._id}'`);

			// Sends the cookie and redirects the client to the dashboard
			res.cookie('Bearer', token, cookieOptions);
			res.redirect(
				environment[process.env.NODE_ENV as 'development' | 'production'].oauth.successRoute
			);
		});
	}

	/**
	 * Creates a set of demo users
	 */
	private async createDemoUsers(session: ClientSession) {
		const peopleCopy = [...people];

		// Creates the demo user
		const me = await new UserModel({
			displayName: peopleCopy[0].displayName,
			email: randomEmail({ domain: 'bigprojects.com' }),
			image: peopleCopy[0].image,
			isDemo: true,
		}).save({ session });

		// Shift out the first user
		peopleCopy.shift();

		// Create the rest of the users
		const newUsers = await Promise.all(
			peopleCopy.map(async (person) =>
				new UserModel({
					displayName: person.displayName,
					email: randomEmail({ domain: 'bigprojects.com' }),
					image: person.image,
					isDemo: true,
				}).save({ session })
			)
		);

		// Puts the user as the first element
		newUsers.unshift(me);

		return newUsers;
	}

	/**
	 * Creates 2 projects and invites all the demo users to the project
	 */
	private async createDemoProjects(users: IUser[], session: ClientSession) {
		const projectsCopy = [...projects];

		// Shift the first user out (this is you)
		const me = users.shift()!;

		const newProjects: IProject[] = [];

		for (const project of projectsCopy) {
			// Invites the additional members
			const members = users.map((u) => u.id);

			// If the project is KeepIt, then make the person a member
			// If the project is Boromi, then send them an invite so they get a notification
			// Creates the project
			const newProject = await new ProjectModel({
				title: project.title,
				description: project.description,
				board: project.board,
				members: project.title === 'KeepIt - Item Tracker' ? [...members, me.id] : [...members],
			}).save({ session });

			newProjects.push(newProject);

			// Attempts to add a project invitation to all the members who were invited
			await Promise.all(
				members.map(async (memberId) => {
					return UserModel.findByIdAndUpdate(
						memberId,
						{
							$push: { projects: newProject.id },
						},
						{ session }
					);
				})
			);

			// If the project is KeepIt, then make the person a member
			// If the project is Boromi, then send them an invite so they get a notification
			if (project.title === 'KeepIt - Item Tracker') {
				me.projects.push(newProject.id);
			} else {
				me.projectInvitations.push(newProject.id);
			}

			// Adds the project to the current user
			await me.save({ session });
		}

		return newProjects;
	}

	/**
	 * Creates 2 projects and invites all the demo users to the project
	 */
	private async createDemoTasks(
		newUsers: IUser[],
		newProjects: IProject[],
		session: ClientSession
	) {
		const copyTasks = [...tasks];

		// Used to assign users tasks in a consistent manner
		let assigneeIndex = 0;

		const newTasks = await Promise.all(
			copyTasks.map((task) => {
				// Skip over the main user if it's a task for Boromi
				if (assigneeIndex === 0 && task.project === 'Boromi - Book Trading') assigneeIndex += 1;

				const projectId =
					task.project === 'KeepIt - Item Tracker' ? newProjects[0].id : newProjects[1].id;
				const userId = newUsers[assigneeIndex].id;

				// Moves to the next user
				assigneeIndex = (assigneeIndex + 1) % newUsers.length;

				return new TaskModel({
					...task,
					project: projectId,
					user: userId,
				}).save({ session });
			})
		);

		// Gets all the tasks assigned to the main user
		// eslint-disable-next-line eqeqeq
		const demoUserTasks = newTasks.filter((t) => t.user == newUsers[0].id);

		// Add all the demo users tasks to their notifications
		await Promise.all(
			demoUserTasks.map(async (task) => {
				await UserModel.findByIdAndUpdate(
					newUsers[0].id,
					{ $push: { newTasks: task.id } },
					{ session }
				);
			})
		);
	}
}

export default DemoController;
