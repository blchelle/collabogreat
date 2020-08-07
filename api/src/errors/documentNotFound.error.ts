import StatusCode from 'status-code-enum';

import APIError from './api.error';

/**
 * Used to create errors caused by the request querying for
 * a document in the database that does not exist
 */
class DocumentNotFoundError extends APIError {
	constructor(id: string, statusCode: StatusCode, modelName: string) {
		super(statusCode, `Unable to find a ${modelName} with the id ${id}`);
	}
}

export default DocumentNotFoundError;
