const User = require('../models/userModel');
const logging = require('../config/logging');

const NAMESPACE = 'User Controller';

/** Use a function that returns a controller for dependency injections */
const createUserController = (database) => {
    const getUser = async (req, res, next) => {
        try {
            const user = await database.getUser(req.params.id);

            if (!user) {
                throw new Error('This user does not exist in the database');
            }

            return res.status(200).json(user);
        } catch (error) {
            logging.error(NAMESPACE, 'caught error', error);
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    };

    const postUser = async (req, res, next) => {
        const { _id, firstname, lastname } = req.body;

        const newUser = {
            _id,
            firstname,
            lastname
        };

        try {
            // determine if id already exists in the database
            const exists = await database.idExists(_id);
            logging.info(NAMESPACE, 'exists boolean var', exists);
            if (exists) {
                throw new Error('ID already exists in the database');
            }
            // save the document to the database
            const result = await database.createUser(newUser);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error
            });
        }
    };

    return {
        getUser,
        postUser
    };
};

module.exports = createUserController;
