const logging = require('../config/logging');
const NAMESPACE = 'Key Controller';

/** helper functions */

// check if key is a valid public key
const keyIsValid = (key) => {
    // check if key is a string
    if (typeof key !== 'string') {
        return false;
    }
    // check if key is length 16
    if (key.length !== 16) {
        return false;
    }
    // check if key is numeric
    if (isNaN(key)) {
        return false;
    }

    return true;
};

/** Use a function that returns a controller for dependency injections */
const createKeyController = (database) => {
    const getKey = async (req, res, next) => {
        // try {
        //     const user = await database.getUser(req.params.id);
        //     if (!user) {
        //         const error = Error('This user does not exist in the database');
        //         error.status = 400;
        //         throw error;
        //     }
        //     return res.status(201).json({
        //         message: 'Query Success',
        //         data: {
        //             _id: user._id,
        //             firstname: user.firstname,
        //             lastname: user.lastname
        //         }
        //     });
        // } catch (error) {
        //     next(error);
        // }
    };

    const postKey = async (req, res, next) => {
        const { _id, public_key } = req.body;

        try {
            // check if key is valid
            if (!keyIsValid(public_key)) {
                const error = new Error('Public Key is invalid.');
                error.status = 400;
                throw error;
            }
            // check if this user exists
            const isExist = await database.idExists(_id);
            if (isExist) {
                const result = await database.updatePublicKey(_id, public_key);
                return res.status(201).json({
                    message: 'Public Key updated successfully.',
                    data: result
                });
            } else {
                const error = new Error('This user does not exist in the database.');
                error.status = 400;
                throw error;
            }
        } catch (error) {
            next(error);
        }
    };

    return {
        getKey,
        postKey
    };
};

module.exports = createKeyController;
