const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = Schema(
    {
        device_id: { type: Number, required: true },
        pre_key_Id: { type: Number, required: true },
        pre_keys: [{ type: String, required: true }],
        identity_key: { type: String, required: true },
        registration_id: { type: Number, required: true },
        signature: { type: String, required: true },
        signed_key_id: { type: Number, required: true },
        signed_pre_key: { type: String, required: true }
    },
    { _id: false }
);

module.exports = keySchema;
