import mongoose, { Document, Schema } from 'mongoose';

interface IProjectUser {
	id: String;
	joined: Boolean;
}

/**
 * The structure of a Project Document
 */
export interface IProject extends Document {
	title: String;
	description: String;
	members: IProjectUser[];
	createdAt: Date;
}

const ProjectMemberSchema = new Schema(
	{
		id: {
			type: Schema.Types.ObjectId,
			required: [true, 'Project Members must have an ID'],
		},
		joined: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

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
	members: [ProjectMemberSchema],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export default ProjectModel;
