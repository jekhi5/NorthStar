import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Comment collection.
 *
 * This schema defines the structure of comment used in questions and answers in the database.
 * Each comment includes the following fields:
 * - `text`: The content of the comment.
 * - `commentBy`: The username of the user who commented.
 * - `commentDateTime`: The date and time when the comment was posted.
 * - `upVotes`: An array of usernames that have upvoted the comment.
 * - `downVotes`: An array of usernames that have downvoted the comment.
 */
const commentSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    commentBy: {
      type: String,
    },
    commentDateTime: {
      type: Date,
    },
    upVotes: [{ type: String }],
    downVotes: [{ type: String }],
  },
  { collection: 'Comment' },
);

export default commentSchema;
