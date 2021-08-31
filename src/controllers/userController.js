const logging = require('../config/logging');
const NAMESPACE = 'User Controller';

/** Use a function that returns a controller for dependency injections */
const createUserController = (database) => {
    const getUser = async (req, res) => {
        try {
            const user = await database.getUser(req.params.id);

            if (!user) {
                throw new Error('This user does not exist in the database');
            }

            return emitResponse(res, 'Query Success', user);
        } catch (error) {
            logging.error(NAMESPACE, 'caught error', error);
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    };

    const postUser = async (req, res) => {
        const { _id, firstname, lastname } = req.body;

        const newUser = {
            _id,
            firstname,
            lastname
        };

        try {
            // determine if id already exists in the database and instead of throwing,
            // we'll just update the existing, so client side receives the callback.
            const isExist = await database.idExists(_id);
            if (isExist) {
                const result = await database.updateExisting(_id, req);
                return emitResponse(res, 'User updated successfully', result);
            }
            // save the document to the database
            const result = await database.createUser(newUser);
            return emitResponse(res, 'User created successfully', result.data);
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

const emitResponse = (res, message, result) => {
    return res.status(201).json({
        success: true,
        message: message,
        data: {
            id: result._id,
            firstname: result.firstname,
            lastname: result.lastname
        }
    });
};

module.exports = createUserController;
