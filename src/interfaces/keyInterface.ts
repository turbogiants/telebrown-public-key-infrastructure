import { Document } from 'mongoose';

export default interface IKey extends Document {
    uid: string;
    public_key: string;
}
