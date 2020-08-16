import mongoose, { Document, Query, Schema } from 'mongoose';

/**
 * The structure of a Project Document
 */
export interface IProject extends Document {
	title: String;
	description: String;
	members: String[];
	createdAt: Date;
}

/**
 * The mongoose schema for Projects
 */
const ProjectSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Please give your Project a name'],
		unique: false,
	},
	description: {
		type: String,
		required: false,
		unique: false,
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

/**
 * Populates the projects property of the user so that it also includes the titles
 */
ProjectSchema.pre<Query<IProject>>(/^find/, function (next) {
	this.populate({
		path: 'members',
		select: ['displayName', 'image'],
	});

	next();
});

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export default ProjectModel;
