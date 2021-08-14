import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import Key from '../models/keyModel';

const NAMESPACE = 'Key Controller';
const getKey = (req: Request, res: Response, next: NextFunction) => {
    Key.findOne({ uid: req.params.uid })
        .exec()
        .then((results) => {
            if (results == null) {
                throw new Error('This user does not exist in the database');
            }
            return res.status(200).json({
                public_key: results.public_key
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postKey = (req: Request, res: Response, next: NextFunction) => {
    const { uid, public_key } = req.body;

    const newKey = new Key({
        uid,
        public_key
    });

    return newKey
        .save()
        .then((result) => {
            return res.status(201).json({
                key: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { getKey, postKey };
