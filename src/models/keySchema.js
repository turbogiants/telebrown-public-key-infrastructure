const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = Schema(
    {
        deviceId: { type: Number, required: true },
        preKeyId: { type: Number, required: true },
        preKeys: [{ type: String, required: true }],
        publicKey: { type: String, required: true },
        registrationId: { type: Number, required: true },
        signature: { type: String, required: true },
        signedKeyId: { type: Number, required: true },
        signedPreKey: { type: String, required: true }
    },
    { _id: false }
);

module.exports = keySchema;
