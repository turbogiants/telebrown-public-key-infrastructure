const logging = require('../config/logging');
const NAMESPACE = 'User Controller';

/** Use a function that returns a controller for dependency injections */
const createUserController = (database) => {
    const getUser = async (req, res, next) => {
        try {
            const user = await database.getUser(req.params.id);

            if (!user) {
                const error = Error('This user does not exist in the database.');
                error.status = 400;
                throw error;
            }

            return res.status(201).json({
                message: 'Query Success',
                data: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    stock_icon: user.stock_icon,
                    profile_url: user.profile_url
                }
            });
        } catch (error) {
            next(error);
        }
    };

    const postUser = async (req, res, next) => {
        const { _id, firstname, lastname, stock_icon, profile_url } = req.body;
        const newUser = {
            _id,
            firstname,
            lastname,
            stock_icon,
            profile_url
        };

        try {
            // verify request body is valid and complete
            if (!(_id && firstname)) {
                const error = new Error('Bad Request. Request body is invalid.');
                error.status = 400;
                res.status(400).json({
                    message: 'Bad Request. User request body is invalid.',
                    status: 400,
                    success: false,
                    error
                });
                throw error;
            }
            // determine if id already exists in the database and instead of throwing,
            // we'll just update the existing, so client side receives the callback.
            const isExist = await database.idExists(_id);
            if (isExist) {
                const result = await database.updateExisting(_id, newUser);
                logging.info(NAMESPACE, 'Updated user here :', result);
                return res.status(200).json({
                    message: 'User updated successfully',
                    data: {
                        _id: result._id,
                        firstname: result.firstname,
                        lastname: result.lastname,
                        stock_icon: result.stock_icon,
                        profile_url: result.profile_url
                    },
                    status: 200,
                    success: true
                });
            }
            // save the document to the database
            const result = await database.createUser(newUser);
            return res.status(201).json({
                message: 'User created successfully',
                data: {
                    _id: result._id,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    stock_icon: result.stock_icon,
                    profile_url: result.profile_url
                },
                status: 201,
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    return {
        getUser,
        postUser
    };
};

module.exports = createUserController;
