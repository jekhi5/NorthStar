import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `text`: The content of the answer.
 * - `ansBy`: The username of the user who provided the answer.
 * - `ansDateTime`: The date and time when the answer was given.
 * - `upVotes`: An array of usernames that have upvoted the answer.
 * - `downVotes`: An array of usernames that have downvoted the answer.
 * - `comments`: Comments that have been added to the answer by users.
 */
const answerSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    ansBy: {
      type: String,
    },
    ansDateTime: {
      type: Date,
    },
    upVotes: [{ type: String }],
    downVotes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { collection: 'Answer' },
);

export default answerSchema;
