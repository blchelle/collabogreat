/* eslint-disable class-methods-use-this */
import Controller from './Controller';
import ProjectModel from '../models/projectModel';

class ProjectController extends Controller {
	private static instance?: ProjectController;

	public path = 'projects';

	private constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router.route('/').get(this.getAll(ProjectModel)).post(this.createOne(ProjectModel));
	}

	public static getInstance() {
		if (!ProjectController.instance) {
			ProjectController.instance = new ProjectController();
		}

		return ProjectController.instance;
	}
}

export default ProjectController;
