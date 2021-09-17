const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        _id: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: false },
        public_key: { type: String, require: false }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', User);
