const express = require('express');
const auth = require('../middlewares/auth');
// TODO: write keyController
const createKeyController = require('../controllers/keyController');

/** Use a function to implement dependency injection */
const createKeyRoutes = (database) => {
    const controller = createKeyController(database);
    const router = express.Router();

    // TODO: add comments
    router.post('/', auth.verifyToken, controller.postKey);

    // TODO: add comments
    router.get('/:id', auth.verifyToken, controller.getKey);

    return router;
};

module.exports = createKeyRoutes;
