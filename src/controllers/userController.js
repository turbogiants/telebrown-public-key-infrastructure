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

            return res.status(201).json({
                success: true,
                message: 'Query Success',
                data: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname
                }
            });
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
                return res.status(201).json({
                    success: true,
                    message: 'User updated successfully',
                    data: {
                        _id: result._id,
                        firstname: result.firstname,
                        lastname: result.lastname
                    }
                });
            }
            // save the document to the database
            const result = await database.createUser(newUser);

            logging.debug(NAMESPACE, 'db res: ', result);
            const data = result.data;
            return res.status(201).json({
                success: result.success,
                message: 'User created successfully',
                data: {
                    _id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname
                }
            });
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
