import mongoose, { Document, Model, Query, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';

/**
 * The structure of a User Document
 */
export interface IUser extends Document {
	displayName: string;
	email: string;
	projects: string[];
	projectInvitations: string[];
	newTasks: string[];
	isDemo: boolean;
	createdAt: Date;
	image?: string;
	googleId?: string;
	githubId?: string;
	facebookId?: string;
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
	projects: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Project',
		},
	],
	projectInvitations: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Project',
		},
	],
	newTasks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Task',
		},
	],
	image: {
		type: String,
		required: false,
	},
	isDemo: {
		type: Boolean,
		immutable: true,
		default: false,
	},
	createdAt: {
		type: Date,
		required: true,
		default: new Date(),
		immutable: true,
	},
	googleId: String,
	githubId: String,
	facebookId: String,
});

/**
 * Populates the projects property of the user so that it also includes the titles
 */
UserSchema.pre<Query<IUser>>('findOne', function (next) {
	this.populate({ path: 'projects' });
	this.populate({ path: 'projectInvitations', select: ['title', 'image'] });
	this.populate({ path: 'newTasks', select: ['title', 'color'] });
	next();
});

// Converts MongoDB code 11000 errors to a Mongoose Validation error with a clean message
UserSchema.plugin(uniqueValidator, { message: 'User with {PATH} {VALUE} already exists' });

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default UserModel;
