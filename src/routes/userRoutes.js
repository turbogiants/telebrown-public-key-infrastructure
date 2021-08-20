const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.post('/create', controller.postUser);

router.get('/user/:id', controller.getUser);

module.exports = router;
