import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';
import { StatusCode } from 'status-code-enum';

import APIError from '../errors/api.error';
import logger from '../utils/logger.utils';

/**
 * The format of the error in the http response
 * It can either be a simple message or an array of messages for multiple errors
 */
type ErrorResponse = string | { [prop: string]: string }[];

/**
 * Catches errors in the express middleware and sends details about them as a response,
 * All 4 parameters are required since that is how express differentiates between normal
 * middleware and error handling middleware
 * @param err The http exception
 * @param _req Incoming request, UNUSED
 * @param res Outgoing Response
 * @param _next Calls the next middleware, UNUSED
 */
function handleError(err: Error, _req: Request, res: Response, _next: NextFunction) {
	let statusCode;
	let responseError: ErrorResponse;
	let responseSolution: string | null = null;

	logger('ErrorHandler', `${err.message} ❌`);

	// Handles the error based on what kind of error is received
	if (err instanceof APIError) {
		statusCode = err.statusCode;
		responseError = err.message;
		responseSolution = err.solution;
	} else if (err instanceof MongooseError.ValidationError) {
		statusCode = StatusCode.ServerErrorInternal;
		responseError = Object.values(err.errors).map(({ path, message }) => {
			return { [path]: message };
		});
	} else if (err instanceof JsonWebTokenError) {
		statusCode = StatusCode.ClientErrorUnauthorized;
		responseError = err.message;
		responseSolution =
			'Try reauthenticating with one of our registered providers: Google, Facebook, or GitHub';
	} else {
		statusCode = StatusCode.ServerErrorInternal;
		responseError = 'Unknown Error';
		responseSolution =
			'This one looks like its on us... If the problem persists, contact us at collabogreat@brockchelle.com';
	}

	res
		.status(statusCode)
		.send({ statusCode, error: { description: responseError, solution: responseSolution } });
}

export default handleError;
