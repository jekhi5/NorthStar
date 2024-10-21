import mongoose, { Model } from 'mongoose';
import commentSchema from './schema/comment';
import { Comment } from '../types';

/**
 * Mongoose model for the `Comment` collection.
 *
 * This model is created using the `Comment` interface and the `commentSchema`, representing the
 * `Comment` collection in the MongoDB database, and provides an interface for interacting with
 * the stored comments.
 *
 * @type {Model<Comment>}
 */
const CommentModel: Model<Comment> = mongoose.model<Comment>('Comment', commentSchema);

export default CommentModel;
