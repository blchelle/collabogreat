import mongoose, { Document, Schema } from 'mongoose';

export enum TaskColor {
	BLACK = '#000000', // Black
	BLUE = '#373FBF', // Blue
	BROWN = '#8F5C38', // Brown
	CYAN = '#00FFFF', // Cyan
	GREEN = '#21BF54', // Green
	GREY = '#B3B3B3', // Grey
	NAVY = '#34495E', // Navy
	ORANGE = '#E67E22', // Orange
	PINK = '#FFC0CB', // Pink
	PURPLE = '#8E44AD', // Purple
	RED = '#E81410', // Red
	YELLOW = '#FFD11F', // Yellow
}

/**
 * The structure of a Task Document
 */
export interface ITask extends Document {
	_id: string;
	title: string;
	description: string;
	status: string;
	order: number;
	user?: string; // A User ID
	project: string; // A Project ID
	color: TaskColor;
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
	order: {
		type: Number,
		required: [true, 'Tasks must have an order assigned to them'],
	},
	color: {
		type: String,
		default: '#B3B3B3', // Grey
		validate: {
			validator(color: unknown) {
				if (typeof color !== 'string') return false;
				return Object.values(TaskColor).includes(color as TaskColor);
			},
			message: `Please enter a valid hexadecimal color code (${Object.values(TaskColor).map(
				(color) => color
			)})`,
		},
	},
});

/**
 * The Project Model which will be used to perform CRUD operations on the Projects collection
 */
const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
export default TaskModel;
