import passport, { Profile, Strategy } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import StatusCode from 'status-code-enum';

import environment from './environment.config';
import keys from './keys.config';
import APIError from '../errors/api.error';
import User, { IUser } from '../models/user.model';

/**
 * This type is used to emulate a similar function used by the Google, Facebook, and
 * github strategies.
 * It can be used by all 3 Strategies to increase DRYness
 */
type VerifyCallback = (err: string | Error | undefined, user?: any, info?: any) => void;

/**
 * All the currently registered OAuth Providers for CollaboGreat
 */
export enum RegisteredOAuthProvider {
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	GITHUB = 'github',
}

passport.serializeUser<IUser, string>((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err, false);
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
	// Attempt to find a user with the provider Id from the provider
	const currentUser = await User.findOne({ [`${profile.provider}Id`]: profile.id });

	if (currentUser) {
		done(undefined, currentUser);
	} else {
		// Attempt to create a new user
		try {
			const newUser = await new User({
				displayName: profile.displayName,
				[`${profile.provider}Id`]: profile.id,
				email: profile.emails ? profile.emails[0].value : null,
				image: profile.photos ? profile.photos[0].value : null,
			}).save();

			done(undefined, newUser);
		} catch (err) {
			done(err, null);
		}
	}
}

/**
 * Sets up a strategy for any of the registered OAuth providers
 * @param provider The provider who's Passport Strategy should be setup
 */
export function configureProviderStrategy(provider: RegisteredOAuthProvider) {
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
			throw new APIError(
				StatusCode.ServerErrorInternal,
				`An unauthorized OAuth provider '${provider}' was provided`
			);
	}
	passport.use(strategy);
}
