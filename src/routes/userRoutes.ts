import express from 'express';
import controller from '../controllers/userController';

const router = express.Router();

router.post('/register', controller.postUser);

router.get('/user/:id', controller.getUser);

export = router;
