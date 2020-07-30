import App from './app';
import ProjectController from './controllers/projectController';
import AuthController from './controllers/authController';
import keys from './config/keys';
import './config/passport.config';

const app = new App([new ProjectController(), new AuthController()]);

// Connect to MongoDB
const { database } = keys.mongoDB;
const { databasePassword } = keys.mongoDB;
const db = database.replace('<PASSWORD>', databasePassword);
App.connectToMongoDB(db);

// Start the Server
app.listen();
module.exports = app;
