import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * The structure of a User Document
 */
export interface IUser extends Document {
	displayName: String;
	email: String;
	image?: String;
	googleId?: String;
	githubId?: String;
	facebookId?: String;
	createdAt: Date;
}

/**
 * The structure of a User Model
 */
interface IUserModel extends Model<IUser> {}

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

UserSchema.plugin(uniqueValidator, { message: 'User with {PATH} {VALUE} already exists' });

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default UserModel;
