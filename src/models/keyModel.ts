import mongoose, { Schema } from 'mongoose';
import IKey from '../interfaces/keyInterface';

const BookSchema: Schema = new Schema(
    {
        uid: { type: String, required: true },
        public_key: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IKey>('Key', BookSchema);
