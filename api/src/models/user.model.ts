import mongoose, { Document, Model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';
import { Profile } from 'passport';
// import StatusCode from 'status-code-enum';
import { VerifyCallback } from '../configs/passport.config';
// import APIError from '../errors/api.error';

/**
 * The structure of a User Document
 */
export interface IUser extends Document {
	displayName: String;
	email: String;
	createdAt: Date;

	image?: String;
	googleId?: String;
	githubId?: String;
	facebookId?: String;
}

/**
 * The structure of a User Model
 */
interface IUserModel extends Model<IUser> {
	findOrCreate: (
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	) => void;
}

/**
 * The mongoose schema for Users
 */
const UserSchema = new Schema({
	displayName: {
		type: String,
		required: [true, 'Please provide your Name'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Please provide your Email Address'],
		index: {
			unique: true,
		},
		trim: true,
		lowercase: true,
		validate: [validator.isEmail, 'The provided email address is invalid'],
	},
	image: {
		type: String,
		required: false,
	},
	googleId: String,
	githubId: String,
	facebookId: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// UserSchema.statics.findOrCreate = async function (profile: Profile, done: VerifyCallback) {
// 	// Attempt to find a user with the provider Id from the provider
// 	const currentUser = await this.findOne({ [`${profile.provider}Id`]: profile.id });

// 	if (currentUser) {
// 		return currentUser;
// 	}
// 	// Attempt to create a new user
// 	try {
// 		const newUser = this.create({
// 			displayName: profile.displayName,
// 			[`${profile.provider}Id`]: profile.id,
// 			email: profile.emails ? profile.emails[0].value : null,
// 			image: profile.photos ? profile.photos[0].value : null,
// 		});

// 		return newUser;
// 	} catch (err) {
// 		return new APIError(StatusCode.ClientErrorBadRequest, 'Unable to create User');
// 	}
// };

UserSchema.plugin(uniqueValidator, { message: 'User with {PATH} {VALUE} already exists' });

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default UserModel;
