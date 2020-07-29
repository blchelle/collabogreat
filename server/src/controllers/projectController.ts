/* eslint-disable class-methods-use-this */
import Controller from './Controller';
import ProjectModel from '../models/projectModel';

class ProjectController extends Controller {
	public path = 'projects';

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router.route('/').get(this.getAll(ProjectModel)).post(this.createOne(ProjectModel));
	}
}

export default ProjectController;
