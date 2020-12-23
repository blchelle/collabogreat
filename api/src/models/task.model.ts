import mongoose, { Document, Schema } from 'mongoose';

/**
 * The structure of a Task Document
 */
export interface ITask extends Document {
	title: string;
	description: string;
	user: string;
	project: string;
	status: string;
}

/**
 * The mongoose schema for Tasks
 */
const TaskSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Please give your Task a name'],
		unique: false,
	},
	description: {
		type: String,
		required: false,
		unique: false,
	},
	user: {
		type: Schema.Types.ObjectId,
		required: [true, 'Please assign the task to a user'],
		ref: 'User',
	},
	project: {
		type: Schema.Types.ObjectId,
		required: [true, 'The Task must belong to a project'],
		ref: 'Project',
	},
	status: {
		type: String,
		default: 'NOT STARTED',
	},
});

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
export default TaskModel;
