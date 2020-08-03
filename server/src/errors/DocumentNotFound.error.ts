import StatusCode from 'status-code-enum';
import APIError from './API.error';

class DocumentNotFoundError extends APIError {
	constructor(id: string, statusCode: StatusCode, modelName: string) {
		super(statusCode, `Unable to find a ${modelName} with the id ${id}`);
	}
}

export default DocumentNotFoundError;
