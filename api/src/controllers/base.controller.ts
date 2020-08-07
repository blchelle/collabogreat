import express, { Request, Response, NextFunction } from 'express';
import { Document, Model } from 'mongoose';
import StatusCode from 'status-code-enum';

import APIError from '../errors/api.error';
import DocumentNotFoundError from '../errors/documentNotFound.error';
import User from '../models/user.model';
import catchAsync from '../utils/catchAsync.util';
import { validateJwt } from '../utils/jwt.util';

/**
 * An abstract base controller class which provides implentation of common methods that
 * controllers can inherit and use without having to provide their own implementation
 */
abstract class Controller {
	/**
	 * The path to the controllers router
	 */
	abstract path: string;

	/**
	 * The mongoogse model corresponding to the controller
	 */
	abstract model: Model<Document, {}>;

	/**
	 * The controllers router
	 */
	public router = express.Router();

	/**
	 * Get all the documents from a collection in the database and send it as a response
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
	 * Create a new document in a collection in the database and send it a a response
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

	/**
	 * Finds a single document from a collection by the documents id
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
				[this.model.modelName]: doc,
			});
		});
	}

	/**
	 * Protects a route from being accessed by an unauthenticated user
	 * An unauthenticated user is someone who makes a request with an invalid
	 * or non-existent JWT
	 */
	protected protectRoute() {
		return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
			// Attempts to extract the user Id from the JWT
			const [idInJWT, err] = validateJwt(req.headers.authorization);
			if (err || !idInJWT) return next(err);

			// Gets the user from the database and attach it to the request
			const user = await User.findById(idInJWT);
			if (!user) {
				return next(
					new APIError(
						StatusCode.ClientErrorUnauthorized,
						'The User embedded in the JWT does not exist'
					)
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