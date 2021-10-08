const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const keySchema = require('./keySchema');

const User = new Schema(
    {
        _id: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: false },
        stock_icon: { type: Number, required: false },
        profile_url: { type: String, required: false },

        // encryption keys
        key: { type: keySchema }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', User);
