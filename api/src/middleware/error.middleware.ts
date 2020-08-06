import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';
import { StatusCode } from 'status-code-enum';

import APIError from '../errors/api.error';

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

	// Handle the error based on what kind of error is received
	if (err instanceof APIError) {
		statusCode = err.statusCode;
		responseError = err.message;
	} else if (err instanceof MongooseError.ValidationError) {
		statusCode = StatusCode.ServerErrorInternal;
		responseError = Object.values(err.errors).map(({ path, message }) => {
			return { [path]: message };
		});
	} else if (err instanceof JsonWebTokenError) {
		statusCode = StatusCode.ClientErrorUnauthorized;
		responseError = err.message;
	} else {
		statusCode = StatusCode.ServerErrorInternal;
		responseError = 'Unknown Error';
	}

	res.status(statusCode).send({ statusCode, data: responseError });
}

export default handleError;
