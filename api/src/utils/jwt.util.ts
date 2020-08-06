/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import { StatusCode } from 'status-code-enum';

import keys from '../configs/keys.config';
import APIError from '../errors/api.error';

/**
 * Checks to see if the user JWT given in the request is valid.
 * If valid, the user id embedded in the token will be returned
 * @param authorizationHeader The authrization header passed in the request
 * @return An array containing the UserId and Error
 */
export function validateJwt(authorizationHeader: string | undefined) {
	// Verify that the req had an authorization header
	if (!authorizationHeader) {
		return [
			null,
			new APIError(
				StatusCode.ClientErrorUnauthorized,
				'No Authorization header was given in the request'
			),
		];
	}

	// Verify that the authorization header used a Bearer token
	const [tokenType, token] = authorizationHeader.split(' ');
	if (tokenType !== 'Bearer') {
		return [
			null,
			new APIError(
				StatusCode.ClientErrorUnauthorized,
				'The Authorization header given in the request must use a Bearer token'
			),
		];
	}

	// Verify that the token is valid (no tampering) and thath the decoded token has an id property
	type DecodedToken = { id: string; iat: number; exp: number };
	const decodedToken = jwt.verify(token, keys.jwt.secret) as DecodedToken;
	if (
		typeof decodedToken !== 'object' ||
		!Object.prototype.hasOwnProperty.call(decodedToken, 'id')
	) {
		return [
			null,
			new APIError(
				StatusCode.ClientErrorUnauthorized,
				"The Decoded JWT doesn't have an user to get information from id"
			),
		];
	}

	return [decodedToken.id, null];
}
