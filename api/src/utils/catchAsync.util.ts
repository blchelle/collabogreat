import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * A wrapper to be used around asynchronous functions that can throw errors,
 * this removes the need to embed any asynchronous code in a try-catch block
 * @param fn The function to wrap
 */
const catchAsync = (fn: RequestHandler) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (err) {
			next(err);
		}
	};
};

export default catchAsync;
