import UsersController  from './controller.js';
import routes from './routes.js';

const users = (container) => {
    const userController = new UsersController(container);

    return routes(userController);
}

export default users;
