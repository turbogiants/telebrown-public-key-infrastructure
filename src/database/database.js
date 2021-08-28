const mongoose = require('mongoose');
const User = require('../models/userModel');
const config = require('../config/config');
const logging = require('../config/logging');

const NAMESPACE = 'Database';

/** connect to mongo db */

// dont connect to mongo if dot env doesn't exist
if (config.mongo.host != 'none') {
    mongoose
        .connect(config.mongo.url, config.mongo.options)
        .then((result) => {
            logging.info(NAMESPACE, 'Mongo Connected');
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
        });
}

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
        return {
            data: newUser,
            success: true
        };
    } catch (error) {
        throw error;
    }
};
module.exports = {
    getUser,
    createUser
};
