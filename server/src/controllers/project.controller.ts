import Controller from './base.controller';
import Project from '../models/project.model';

/**
 * A controller used to perform operations relating to the Project Model
 */
class ProjectController extends Controller {
	public path = 'projects';

	public model = Project;

	constructor() {
		super();
		this.initRoutes();
	}

	protected initRoutes() {
		this.router.route('/').get(this.getAll()).post(this.createOne());
		this.router.route('/:id').get(this.getOneById()).delete(this.deleteOneById());
	}
}

export default ProjectController;
