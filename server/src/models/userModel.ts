import mongoose, { Document, Model, Schema } from 'mongoose';
import isEmail from 'validator/es/lib/isEmail';

interface IUser extends Document {
	displayName: String;
	email: String;
	image?: String;
	googleId?: String;
	githubId?: String;
	facebookId?: String;
	createdAt: Date;
}

interface IUserModel extends Model<IUser> {}

const UserSchema = new Schema({
	displayName: {
		type: String,
		required: [true, 'Please provide your name'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Please provide your email address'],
		unique: true,
		trim: true,
		lowercase: true,
		validate: [isEmail, 'The provided email address is invalid'],
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

const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default UserModel;
