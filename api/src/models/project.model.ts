import mongoose, { Document, Query, Schema } from 'mongoose';

/**
 * The structure of a Project Document
 */
export interface IProject extends Document {
	title: string;
	description: string;
	members: string[];
	createdAt: Date;
	board: string[];
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
	board: {
		type: Schema.Types.Array,
		default: ['Not Started', 'In Progress', 'Done'],
		minlength: 1,
		maxlength: 10,
		validate: [
			{
				validator(arr: unknown[]) {
					return arr.filter((el) => typeof el !== 'string').length === 0;
				},
				message: 'All stage names must be a string',
			},
			{
				validator(arr: unknown[]) {
					return arr.length < 10;
				},
				message: 'Boards can have a max of 10 stages',
			},
			{
				validator(arr: unknown[]) {
					return arr.length > 0;
				},
				message: 'Boards must have at least one stage',
			},
			{
				validator(arr: unknown[]) {
					return arr.length === new Set(arr).size;
				},
				message: 'Boards cannot have stages with duplicate names',
			},
		],
	},
});

/**
 * Populates the members property of the project before a find
 */
ProjectSchema.pre<Query<IProject>>(/^find/, function (next) {
	this.populate({
		path: 'members',
		select: ['displayName', 'image', 'email'],
	});

	next();
});

/**
 * Populates the members property of the project after a save
 */
ProjectSchema.post<IProject>('save', function (doc) {
	doc.populate({ path: 'members', select: ['displayName', 'image'] }).execPopulate();
});

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export default ProjectModel;
