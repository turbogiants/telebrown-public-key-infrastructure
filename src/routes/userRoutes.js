const express = require('express');
const auth = require('../middlewares/auth');
const createUserController = require('../controllers/userController');

/** Use a function to implement dependency injection */
const createUserRoutes = (database) => {
    const controller = createUserController(database);
    const router = express.Router();

    // TODO: add comments
    router.post('/', auth.verifyToken, controller.postUser);

    // router.get('/user/query', auth.verifyToken, controller.queryUsersByName);

    // TODO: add comments
    router.get('/:id', auth.verifyToken, controller.getUser);

    return router;
};

module.exports = createUserRoutes;
