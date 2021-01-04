import express, { Request, Response, NextFunction } from 'express';
import { Document, Model } from 'mongoose';
import StatusCode from 'status-code-enum';
import APIError from '../errors/api.error';

import DocumentNotFoundError from '../errors/documentNotFound.error';
import User from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';
import { validateJwt } from '../utils/jwt.util';

/**
 * An abstract base controller class which provides implementation of common methods that
 * controllers can inherit and use without having to provide their own implementation
 */
abstract class Controller {
	/**
	 * The path to the controllers router
	 */
	abstract path: string;

	/**
	 * The mongoose model corresponding to the controller
	 */
	abstract model: Model<Document, {}>;

	/**
	 * The controllers router
	 */
	public router = express.Router();

	/**
	 * Gets all the documents from a collection in the database and sends it in the response
	 */
	protected getAll() {
		return catchAsync(async (_: Request, res: Response) => {
			const docs = await this.model.find();

			res.status(StatusCode.SuccessOK).json({
				success: true,
				[`${this.model.modelName}s`]: docs,
			});
		});
	}

	/**
	 * Creates a new document in a collection in the database and sends it in the response
	 */
	protected createOne() {
		return catchAsync(async (req: Request, res: Response) => {
			const doc = await this.model.create(req.body);

			res.status(StatusCode.SuccessCreated).json({
				success: true,
				[this.model.modelName]: doc,
			});
		});
	}

	/**
	 * Deletes a single document from a collection by the document's id
	 */
	protected deleteOneById() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Attempts to find the document, deletes it if found
			const doc = await this.model.findByIdAndDelete(req.params.id);
			if (!doc) {
				return next(
					new DocumentNotFoundError(
						req.params.id,
						StatusCode.ClientErrorNotFound,
						this.model.modelName
					)
				);
			}

			// Sends an empty response to indicate it was deleted successfully
			res.status(StatusCode.SuccessNoContent).json({
				status: 'success',
				[this.model.modelName]: doc,
			});
		});
	}

	protected patchOne() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			const modelName = this.model.modelName.toLowerCase();

			if (!req.body[modelName]) {
				return next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						`No field '${modelName}' was found in the body of the request`,
						`Make sure the body of your request has a '${modelName}' field`
					)
				);
			}

			const reqBody = req.body[modelName];

			if (!reqBody._id) {
				return next(
					new APIError(
						StatusCode.ClientErrorBadRequest,
						"The body of the incoming request had no '_id' field",
						'Please pass the _id of the document you want to modify'
					)
				);
			}

			const doc = await this.model.findByIdAndUpdate(reqBody._id, reqBody, { new: true });

			res.status(StatusCode.SuccessOK).json({ [modelName]: doc });
		});
	}

	/**
	 * Finds a single document from a collection by the documents id.
	 * Then the document is sent in the response
	 */
	protected getOneById() {
		return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
			// Attempts to find the document
			const doc = await this.model.findById(req.params.id);

			if (!doc) {
				return next(
					new DocumentNotFoundError(
						req.params.id,
						StatusCode.ClientErrorNotFound,
						this.model.modelName
					)
				);
			}

			// Sends the response with the document embedded
			res.status(StatusCode.SuccessOK).json({
				status: 'success',
				[this.model.modelName.toLowerCase()]: doc,
			});
		});
	}

	/**
	 * Protects a route from being accessed by an unauthenticated user.
	 * An unauthenticated user is someone who makes a request with an invalid
	 * or non-existent JWT
	 */
	protected protectRoute() {
		return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
			// Attempts to extract the user Id from the JWT
			const [idInJWT, err] = validateJwt(req.headers.cookie);

			if (err || !idInJWT) return next(err);

			// Gets the user from the database and attach it to the request
			const user = await User.findById(idInJWT);
			if (!user) {
				return next(
					new DocumentNotFoundError(idInJWT as string, StatusCode.ClientErrorNotFound, 'user')
				);
			}

			req.user = user;
			next();
		});
	}

	/**
	 * Initializes all of the routes that the controllers router will handle
	 */
	protected abstract initRoutes(): void;
}

export default Controller;
