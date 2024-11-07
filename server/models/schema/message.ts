import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Message collection.
 *
 * This schema defines the structure for storing chat messages in the database.
 * Each message includes the following fields:
 * - `content`: The content of the message.
 * - `sentBy`: The the user who wrote the message.
 * - `sentDateTime`: The date and time when the message was sent.
 */
const messageSchema: Schema = new Schema(
  {
    content: {
      type: String,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sentDateTime: {
      type: Date,
    },
  },
  { collection: 'Message' },
);

export default messageSchema;
