import Controller from './Controller';
import Project from '../models/projectModel';

/**
 * A controller used to perform operations relating to the Project Model
 */
class ProjectController extends Controller {
	public path = 'projects';

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router.route('/').get(this.getAll(Project)).post(this.createOne(Project));
	}
}

export default ProjectController;
