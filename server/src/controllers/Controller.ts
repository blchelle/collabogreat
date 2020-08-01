/* eslint-disable class-methods-use-this */
import express, { Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import StatusCode from 'status-code-enum';
import catchAsync from '../utils/catchAsync.utils';

abstract class Controller {
	abstract path: string;

	public router = express.Router();

	protected getAll(model: Model<Document, {}>) {
		return catchAsync(async (_: Request, res: Response) => {
			const docs = await model.find();

			res.status(StatusCode.SuccessOK).json({
				success: true,
				[`${model.modelName}s`]: docs,
			});
		});
	}

	protected createOne(model: Model<Document, {}>) {
		return catchAsync(async (req: Request, res: Response) => {
			const doc = await model.create(req.body);

			res.status(StatusCode.SuccessCreated).json({
				success: true,
				[model.modelName]: doc,
			});
		});
	}

	protected abstract initRoutes(): void;
}

export default Controller;
