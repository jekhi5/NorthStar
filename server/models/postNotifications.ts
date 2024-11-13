import mongoose, { Model } from 'mongoose';
import postNotificationSchema from './schema/postNotification';
import { PostNotification } from '../types';

/**
 * Mongoose model for the `PostNotification` collection.
 *
 * This model is created using the `PostNotification` interface and the `notificationSchema`, representing the
 * `PostNotification` collection in the MongoDB database, and provides an interface for interacting with
 * the stored PostNotification.
 *
 * @type {Model<PostNotification>}
 */
const PostNotificationModel: Model<PostNotification> = mongoose.model<PostNotification>(
  'PostNotification',
  postNotificationSchema,
);

export default PostNotificationModel;
