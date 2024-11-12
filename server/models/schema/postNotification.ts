import { Schema } from 'mongoose';

/**
 * Mongoose schema for the PostNotification collection.
 *
 * This schema defines the structure of PostNotification used in the database.
 * Each PostNotification includes the following fields:
 * - title - The title of the PostNotification.
 * - text - The content of the PostNotification.
 * - postType - The type of the post that the PostNotification is about.
 * - postId - The unique identifier of the post that the PostNotification is about.
 * - fromUser - The user who triggered the PostNotification.
 * - forUser - The user who the PostNotification is for.
 */

const postNotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    postType: {
      type: String,
    },
    // TODO: Investigate how to reference different kinds of posts
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    forUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { collection: 'PostNotification' },
);

export default postNotificationSchema;
