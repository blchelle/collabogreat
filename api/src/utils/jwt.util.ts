/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import { StatusCode } from 'status-code-enum';

import keys from '../configs/keys.config';
import APIError from '../errors/api.error';
import logger from './logger.utils';

function unauthorizedError() {
	return new APIError(
		StatusCode.ClientErrorUnauthorized,
		"We're unable to confirm your identity",
		'Try authenticating with one of our registered providers: Google, Facebook or Github'
	);
}

/**
 * Checks to see if the user JWT given in the request is valid.
 * If valid, the user id embedded in the token will be returned
 * @param authorizationHeader The authrization header passed in the request
 * @return An array containing the UserId and Error
 */
export function validateJwt(authorizationHeader: string | undefined) {
	logger('JWT UTIL', `Cookie: ${authorizationHeader}`);

	// Verify that the req had an authorization header
	if (!authorizationHeader) return [null, unauthorizedError()];

	// Verify that the authorization header used a Bearer token
	// Splitting the header on a space will give us an array like this -> [TokenType, Token]
	const [tokenType, token] = authorizationHeader.split('=');
	if (tokenType !== 'Bearer') {
		return [null, unauthorizedError()];
	}

	// Verify that the token is valid (no tampering) and that the decoded token has an id property
	type DecodedToken = { id: string; iat: number; exp: number };
	const decodedToken = jwt.verify(token, keys.jwt.secret) as DecodedToken;
	if (
		typeof decodedToken !== 'object' ||
		!Object.prototype.hasOwnProperty.call(decodedToken, 'id')
	) {
		return [null, unauthorizedError()];
	}

	return [decodedToken.id, null];
}
