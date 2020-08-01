/* eslint-disable class-methods-use-this */
import express, { Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import StatusCode from 'status-code-enum';
import catchAsync from '../utils/catchAsync.utils';

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
	 * The controllers router
	 */
	public router = express.Router();

	/**
	 * Get all the documents from a collection in the database and send it as a response
	 * @param model The model whose collection to get data from
	 */
	protected getAll(model: Model<Document, {}>) {
		return catchAsync(async (_: Request, res: Response) => {
			const docs = await model.find();

			res.status(StatusCode.SuccessOK).json({
				success: true,
				[`${model.modelName}s`]: docs,
			});
		});
	}

	/**
	 * Create a new document in a collection in the database and send it a a response
	 * @param model The model whose collection to create a document
	 */
	protected createOne(model: Model<Document, {}>) {
		return catchAsync(async (req: Request, res: Response) => {
			const doc = await model.create(req.body);

			res.status(StatusCode.SuccessCreated).json({
				success: true,
				[model.modelName]: doc,
			});
		});
	}

	/**
	 * Initializes all of the routes that the controllers router will handle
	 */
	protected abstract initRoutes(): void;
}

export default Controller;
