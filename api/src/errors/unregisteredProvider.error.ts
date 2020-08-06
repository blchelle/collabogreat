import StatusCode from 'status-code-enum';

import APIError from './api.error';

/**
 * A class used to handle errors caused by trying to authenticate with a provider
 * not registered with CollaboGreat
 */
class UnregisteredProviderError extends APIError {
	constructor(statusCode: StatusCode, providerName: string) {
		super(statusCode, `Failed to authenticate with unregistered provider '${providerName}'`);
	}
}

export default UnregisteredProviderError;
