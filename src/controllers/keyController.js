const logging = require('../config/logging');
const NAMESPACE = 'Key Controller';

/** helper functions */

// check if key is a valid public key
const idIsValid = (key) => {
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
        const { id } = req.params;
        try {
            const key = await database.getKey(id);

            res.json({
                message: 'Query Success.',
                status: 200,
                success: true,
                data: {
                    key
                }
            });
        } catch (error) {
            next(error);
        }
    };

    const postKey = async (req, res, next) => {
        const { _id, public_key } = req.body;

        try {
            const success = await database.postKey(_id, public_key);

            if (success) {
                res.status(201).json({
                    message: 'Public Key has been posted.',
                    status: 201,
                    success: true
                });
            } else {
                res.status(500).json({
                    message: 'Public Key has not been posted.',
                    status: 500,
                    success: false
                });
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
