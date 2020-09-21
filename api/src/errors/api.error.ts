import { StatusCode } from 'status-code-enum';

/**
 * Used for creating API Errors.
 * These errors can be caused by a malformed request, an internal server error, a failed database
 * operation, the client trying to access a resource which they do not have the authorization for,
 * the client trying to access a resource which does not exist, etc...
 */
class APIError extends Error {
	/**
	 * The HTTP status code that will be sent in the response
	 */
	statusCode: StatusCode;

	/**
	 * Useful information that will help the user resolve their error
	 * Sometimes it may be null if a solution is unknown
	 */
	solution: string | null;

	constructor(statusCode: StatusCode, message: string, solution: string | null = null) {
		super(message);

		this.statusCode = statusCode;
		this.message = message;
		this.solution = solution;

		// Prevents APIError objects from being implicitly casted to Error
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export default APIError;
