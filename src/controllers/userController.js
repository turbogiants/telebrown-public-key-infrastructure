const User = require('../models/userModel');

const NAMESPACE = 'User Controller';
const getUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .exec()
        .then((results) => {
            if (results == null) {
                throw new Error('This user does not exist in the database');
            }
            return res.status(200).json({
                id: results._id,
                username: results.firstname,
                lastname: results.lastname
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const postUser = async (req, res, next) => {
    const { _id, firstname, lastname } = req.body;

    const newKey = new User({
        _id,
        firstname,
        lastname
    });

    try {
        const result = newKey.save(function (err) {
            if (err) throw err;
        });
        return res.status(201).json({
            data: result,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};

module.exports = { getUser, postUser };
