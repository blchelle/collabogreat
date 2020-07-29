import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import keys from './keys';
import UserModel from '../models/userModel';

passport.serializeUser<any, any>((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	UserModel.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err, false);
		});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.google.clientId,
			clientSecret: keys.google.clientSecret,
			callbackURL: '/api/v0/auth/google/redirect',
		},
		(_: string, __: string, profile: Profile, done: VerifyCallback) => {
			// passport callback function
			// check if user already exists in our db with the given profile ID
			UserModel.findOne({ googleId: profile.id }).then((currentUser) => {
				if (currentUser) {
					// if we already have a record with the given profile ID
					done(undefined, currentUser);
				} else {
					// if not, create a new user
					new UserModel({
						displayName: profile.displayName,
						googleId: profile.id,
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
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: keys.facebook.clientId,
			clientSecret: keys.facebook.clientSecret,
			callbackURL: '/api/v0/auth/facebook/redirect',
		},
		(_: string, __: string, profile: Profile, done: VerifyCallback) => {
			// passport callback function
			// check if user already exists in our db with the given profile ID
			UserModel.findOne({ facebookId: profile.id }).then((currentUser) => {
				if (currentUser) {
					// if we already have a record with the given profile ID
					done(undefined, currentUser);
				} else {
					// if not, create a new user
					new UserModel({
						displayName: profile.displayName,
						facebookId: profile.id,
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
	)
);

passport.use(
	new GitHubStrategy(
		{
			clientID: keys.github.clientId,
			clientSecret: keys.github.clientSecret,
			callbackURL: '/api/v0/auth/github/redirect',
		},
		(_: string, __: string, profile: Profile, done: VerifyCallback) => {
			// passport callback function
			// check if user already exists in our db with the given profile ID
			UserModel.findOne({ githubId: profile.id }).then((currentUser) => {
				if (currentUser) {
					// if we already have a record with the given profile ID
					done(undefined, currentUser);
				} else {
					// if not, create a new user
					new UserModel({
						displayName: profile.displayName,
						githubId: profile.id,
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
	)
);
