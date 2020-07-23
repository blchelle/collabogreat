import mongoose, { Document, Schema } from 'mongoose';

interface IProject extends Document {
	title: string;
	description: string;
}

const ProjectSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: false,
	},
	description: {
		type: String,
		required: false,
		unique: false,
	},
});

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export default ProjectModel;
