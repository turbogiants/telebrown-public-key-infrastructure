const express = require('express');
const auth = require('../middlewares/auth');
const createUserController = require('../controllers/userController');

/** Use a function to implement dependency injection */
const createUserRoutes = (database) => {
    const controller = createUserController(database);
    const router = express.Router();

    router.post('/user', auth.verifyToken, controller.postUser);

    // router.get('/user/query', auth.verifyToken, controller.queryUsersByName);

    router.get('/user/:id', auth.verifyToken, controller.getUser);

    return router;
};

module.exports = createUserRoutes;
