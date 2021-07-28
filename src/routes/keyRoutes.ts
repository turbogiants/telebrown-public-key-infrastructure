import express from 'express';
import controller from '../controllers/keyController';

const router = express.Router();

router.post('/', controller.postKey);

router.get('/:uid', controller.getKey);

export = router;
