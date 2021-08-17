import mongoose, { Schema } from 'mongoose';
import IUSer from '../interfaces/userInterfaces';

const User: Schema = new Schema(
    {
        _id: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUSer>('User', User);
