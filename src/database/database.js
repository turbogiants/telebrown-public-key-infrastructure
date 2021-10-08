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
        const result = await newUser.save();
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

    const user = await User.findByIdAndUpdate(_id, update, { runValidators: true });
    return true;
};

const getKey = async (_id) => {
    // get key

    // TODO: omg please change this. this is terrible code
    const result = await User.findById(_id, 'key');

    logging.info(NAMESPACE, 'result: ', result);

    const preKey = result.key.pre_keys[0];

    await User.updateOne(
        { _id },
        {
            $pull: {
                'key.preKeys': preKey
            }
        }
    );

    const key = {
        device_id: result.key.device_id,
        pre_key_id: result.key.pre_key_id,
        pre_key: preKey,
        identity_key: result.key.identity_key,
        registration_id: result.key.registration_id,
        signature: result.key.signature,
        signed_key_id: result.key.signed_key_id,
        signed_pre_key: result.key.signed_pre_key
    };

    return key;
};

/** Key functions */

module.exports = {
    getUser,
    createUser,
    idExists,
    updateExisting,
    postKey,
    getKey
};
