import { StatusCode } from 'status-code-enum';

/**
 * A class used for handling HTTP errors
 * These errors can be caused by a malformed request, an internal server error, failed database
 * operation, the client trying to access a resource which they do not have the authorization for,
 * the client trying to access a resource which does not exist, etc...
 */
class APIError extends Error {
	/**
	 * The HTTP status code that will be sent in the response
	 */
	statusCode: StatusCode;

	constructor(statusCode: StatusCode, message: string) {
		super(message);

		this.statusCode = statusCode;
		this.message = message;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export default APIError;
