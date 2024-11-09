import mongoose, { Model } from 'mongoose';
import messageSchema from './schema/message';
import { Message } from '../types';

/**
 * Mongoose model for the `Message` collection.
 *
 * This model is created using the `Message` interface and the `messageSchema`, representing the
 * `Message` collection in the MongoDB database, and provides an interface for interacting with
 * the stored message.
 *
 * @type {Model<Message>}
 */
const MessageModel: Model<Message> = mongoose.model<Message>('Message', messageSchema);

export default MessageModel;
