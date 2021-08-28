const express = require('express');
const createUserController = require('../controllers/userController');

/** Use a function to implement dependency injection */
const createUserRoutes = (database) => {
    const controller = createUserController(database);
    const router = express.Router();

    router.post('/create', controller.postUser);

    router.get('/user/:id', controller.getUser);

    return router;
};

module.exports = createUserRoutes;
