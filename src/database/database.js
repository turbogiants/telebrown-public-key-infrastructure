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

/** User functions */

const getUser = async (id) => {
    try {
        const user = await User.findOne({ _id: id });
        return user;
    } catch (error) {
        return null;
    }
};

const createUser = async (user) => {
    const newUser = new User(user);
    try {
        const result = await newUser.save(function (err) {
            if (err) throw err;
        });
        return newUser;
    } catch (error) {
        throw error;
    }
};

/** Returns true if id already exists in the collection */
const idExists = async (id) => {
    return await User.exists({ _id: id });
};

const updateExisting = async (id, data) => {
    return await User.findOneAndUpdate({ _id: id }, data, { new: true }, function (err, user) {
        if (err) {
            logging.error(NAMESPACE, 'Error here', err);
        }
        logging.error(NAMESPACE, 'data here', user);
    });
};

// TODO: finish
const postKey = async (_id, public_key) => {
    // update
    const update = { key: public_key };

    const user = await User.findByIdAndUpdate(_id, update);

    logging.debug(NAMESPACE, 'user: ', user);
    if (!user) {
        return false;
    }

    return true;
};

const getPublicKey = async (_id) => {
    return 'pubkey';
};

/** Key functions */

module.exports = {
    getUser,
    createUser,
    idExists,
    updateExisting,
    postKey
};
