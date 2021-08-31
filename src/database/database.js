const mongoose = require('mongoose');
const User = require('../models/userModel');
const config = require('../config/config');
const logging = require('../config/logging');

const NAMESPACE = 'Database';

/** connect to mongo db */

// dont connect to mongo if dot env doesn't exist
if (config.mongo.host !== 'none') {
    mongoose.set('useFindAndModify', false);
    mongoose
        .connect(config.mongo.url, config.mongo.options)
        .then(() => {
            logging.info(NAMESPACE, 'Mongo Connected');
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
        });
}

const getUser = async (id) => {
    try {
        return await User.findOne({ _id: id });
    } catch (error) {
        return null;
    }
};

const createUser = async (user) => {
    try {
        const result = await new User(user).save(function(err) {
            if (err) throw err;
        });
        logging.debug(NAMESPACE, "the result", result);
        return {
            test: true,
            data: user
        };
    } catch (error) {
        logging.error(NAMESPACE, 'caught error', error);
        throw error;
    }
};

/** Returns true if id already exists in the collection */
const idExists = async (id) => {
    const exists = await User.exists({ _id: id });
    logging.info(NAMESPACE, 'exists var', exists);

    return exists;
};

const updateExisting = async (id, req) => {
    return User.findOneAndUpdate({ _id: id }, req.body, { new: true },
        function(err, user) {
            if (err) {
                logging.info(NAMESPACE, 'Error here', err);
            }
            logging.info(NAMESPACE, 'data here', user);
        }
    );
};

module.exports = {
    getUser,
    createUser,
    idExists,
    updateExisting
};
