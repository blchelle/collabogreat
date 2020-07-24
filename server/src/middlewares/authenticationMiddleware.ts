import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`,
	}),

	// Validate the audience and the issuer.
	audience: process.env.AUTH0_AUDIENCE,
	issuer: process.env.AUTH0_ISSUER,
	algorithms: ['RS256'],
});

export default checkJwt;
