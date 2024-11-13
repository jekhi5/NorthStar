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
 */

const postNotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      enum: ['Question', 'Answer', 'Comment'],
      required: true,
    },
    // No ref is given here because the post could be a question, answer, or comment
    // When a query is made, the ref can be dynamically determined based on the postType
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { collection: 'PostNotification' },
);

export default postNotificationSchema;
