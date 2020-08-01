import passport, { Profile, Strategy } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import environment from './environment.config';
import keys from './keys.config';
import User, { IUser } from '../models/userModel';

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
 * Checks if the user contained within {@link profile} already exists.
 * If so, then their information will be retrieved
 * Otherwise, they will be added to the database
 * @param _ The access token for the provider, this is an unused parameter
 * @param __ The refresh token for the provider, this is an unused parameter
 * @param profile The users profile from the provider they selected
 * @param done A method used to verify the users authentication
 */
function StrategyCallback(_: string, __: string, profile: Profile, done: VerifyCallback) {
	User.findOne({ [`${profile.provider}Id`]: profile.id }).then((currentUser) => {
		if (currentUser) {
			// if we already have a record with the given profile ID
			done(undefined, currentUser);
		} else {
			new User({
				displayName: profile.displayName,
				[`${profile.provider}Id`]: profile.id,
				email: profile.emails ? profile.emails[0].value : null,
				image: profile.photos ? profile.photos[0].value : null,
			})
				.save()
				.then((newUser) => {
					done(undefined, newUser);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});
}

/**
 * Sets up a strategy for any of the registered OAuth providers
 * @param provider The provider who's Passport Strategy should be setup
 */
export function configureProviderStrategy(provider: RegisteredOAuthProvider) {
	const config = {
		clientID: keys[provider].clientId,
		clientSecret: keys[provider].clientSecret,
		callbackURL: `/api/v${environment.development.version}/auth/${provider}/redirect`,
	};

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
			throw new Error(`An unauthorized OAuth provider '${provider}' was provided`);
	}
	passport.use(strategy);
}
