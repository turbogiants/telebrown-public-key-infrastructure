const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keyScema = Schema({
    identityKey: { type: String, required: true }

    // TODO: add more props
});

module.exports = keySchema;
