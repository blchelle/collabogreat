import StatusCode from 'status-code-enum';

import APIError from './api.error';

/**
 * A class used to handle errors caused by the request querying for
 * an document in the database that does not exist
 */
class UnregisteredProviderError extends APIError {
	constructor(statusCode: StatusCode, providerName: string) {
		super(statusCode, `Failed to authenticate with unregistered provider '${providerName}'`);
	}
}

export default UnregisteredProviderError;
