import passport, { Profile, Strategy } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import StatusCode from 'status-code-enum';

import environment from './environment.config';
import keys from './keys.config';
import APIError from '../errors/api.error';
import User, { IUser } from '../models/user.model';
import UnregisteredProviderError from '../errors/unregisteredProvider.error';

/**
 * This type is used to emulate a similar function used by the Google, Facebook, and
 * github strategies.
 * It can be used by all 3 Strategies to increase DRYness
 */
export type VerifyCallback = (err: string | Error | undefined, user?: any, info?: any) => void;

/**
 * All the currently registered OAuth Providers for CollaboGreat
 */
export enum RegisteredOAuthProvider {
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	GITHUB = 'github',
}

// These functions are required for getting data To/from JSON returned from Providers
passport.serializeUser<IUser, string>(function (user, done) {
	console.log('Serializing the user');
	done(null, user.id);
});

passport.deserializeUser<IUser, string>(function (id, done) {
	console.log('Deserializing the user');
	User.findById(id, function (err, user) {
		done(err, user ?? undefined);
	});
});

/**
 * Checks if the user contained within 'profile' already exists.
 * If so, then their information will be retrieved
 * Otherwise, they will be added to the database
 * @param _accessToken The access token for the provider (UNUSED)
 * @param _refreshToken The refresh token for the provider (UNUSED)
 * @param profile The users profile from the provider they selected
 * @param done A method used to verify the users authentication
 */
async function StrategyCallback(
	_accessToken: string,
	_refreshToken: string,
	profile: Profile,
	done: VerifyCallback
) {
	const { provider } = profile;
	const currentUser = await User.findOne({ [`${provider}Id`]: profile.id });
	if (currentUser) {
		return done(undefined, currentUser);
	}

	// Otherwise, we need to create a new user
	try {
		const newUser = await new User({
			displayName: profile.displayName,
			email: profile.emails ? profile.emails[0].value : null,
			image: profile.photos ? profile.photos[0].value : null,
			[`${provider}Id`]: profile.id,
		}).save();

		done(undefined, newUser);
	} catch (err) {
		done(err);
	}
}

/**
 * Sets up a strategy for any of the registered OAuth providers
 * @param provider The provider who's Passport Strategy should be setup
 */
function configureProviderStrategy(provider: RegisteredOAuthProvider) {
	// Specify the keys needed to connect to the OAuth provider
	const config = {
		clientID: keys[provider].clientId,
		clientSecret: keys[provider].clientSecret,
		callbackURL: `/api/v${environment.development.version}/auth/${provider}/redirect`,
	};

	// Create a new stategy corresponding for the provider that was passed in
	let strategy: Strategy;
	switch (provider) {
		case RegisteredOAuthProvider.FACEBOOK:
			strategy = new FacebookStrategy(config, StrategyCallback);
			break;
		case RegisteredOAuthProvider.GOOGLE:
			strategy = new GoogleStrategy(config, StrategyCallback);
			break;
		case RegisteredOAuthProvider.GITHUB:
			strategy = new GitHubStrategy(config, StrategyCallback);
			break;
		default:
			throw new UnregisteredProviderError(StatusCode.ServerErrorInternal, provider);
	}
	passport.use(strategy);
}

// Passport Provider Setup
Object.values(RegisteredOAuthProvider).forEach((provider) => configureProviderStrategy(provider));

export default RegisteredOAuthProvider;
