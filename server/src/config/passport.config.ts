import passport, { Profile, Strategy } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import keys from './keys.config';
import environment from './environment.config';
import User, { IUser } from '../models/userModel';

type VerifyCallback = (err: string | Error | undefined, user?: any, info?: any) => void;

enum RegisteredOAuthProvider {
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

function configureProviderStrategy(provider: RegisteredOAuthProvider) {
	const config = {
		clientID: keys[provider].clientId,
		clientSecret: keys[provider].clientSecret,
		callbackURL: `/api/v${environment.development.version}/auth/${provider}/redirect`,
	};

	const callbackFn = (_: string, __: string, profile: Profile, done: VerifyCallback) => {
		// passport callback function
		// check if user already exists in our db with the given profile ID
		User.findOne({ [`${provider}Id`]: profile.id }).then((currentUser) => {
			if (currentUser) {
				// if we already have a record with the given profile ID
				done(undefined, currentUser);
			} else {
				new User({
					displayName: profile.displayName,
					[`${provider}Id`]: profile.id,
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
	};

	let strategy: Strategy;

	switch (provider) {
		case RegisteredOAuthProvider.FACEBOOK:
			strategy = new FacebookStrategy(config, callbackFn);
			break;
		case RegisteredOAuthProvider.GOOGLE:
			strategy = new GoogleStrategy(config, callbackFn);
			break;
		case RegisteredOAuthProvider.GITHUB:
			strategy = new GitHubStrategy(config, callbackFn);
			break;
		default:
			throw new Error(`An unauthorized OAuth provider '${provider}' was provided`);
	}
	passport.use(strategy);
}

configureProviderStrategy(RegisteredOAuthProvider.FACEBOOK);
configureProviderStrategy(RegisteredOAuthProvider.GOOGLE);
configureProviderStrategy(RegisteredOAuthProvider.GITHUB);
