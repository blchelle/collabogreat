import mongoose, { Document, Model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Profile } from 'passport';
import validator from 'validator';

import { VerifyCallback } from '../configs/passport.config';

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

// Converts MongoDB code 11000 errors to a Mongoose Validation error with a clean message
UserSchema.plugin(uniqueValidator, { message: 'User with {PATH} {VALUE} already exists' });

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default UserModel;
