import mongoose, { Model } from 'mongoose';
import userSchema from './schema/user';
import { User } from '../types';

/**
 * Mongoose model for the `User` collection.
 *
 * This model is created using the `User` interface and the `userSchema`, representing the
 * `User` collection in the MongoDB database, and provides an interface for interacting with
 * the stored Users.
 *
 * @type {Model<User>}
 */
const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
