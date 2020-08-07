import StatusCode from 'status-code-enum';

import APIError from './api.error';

/**
 * Used to create errors caused by trying to authenticate with an unregistered provider
 */
class UnregisteredProviderError extends APIError {
	constructor(statusCode: StatusCode, providerName: string) {
		super(statusCode, `Failed to authenticate with unregistered provider '${providerName}'`);
	}
}

export default UnregisteredProviderError;
