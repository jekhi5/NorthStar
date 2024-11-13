import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { User } from '../../types';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `uid`: The unique identifier for the user. This field is required and unique.
 * - `username`: The username of the user. This field is required.
 * - `email`: The email address of the user. This field is required and unique.
 * - `firstName`: The first name of the user. This field is optional.
 * - `lastName`: The last name of the user. This field is optional.
 * - `profilePicture`: The URL of the user's profile photo. This field is optional.
 * - `status`: An enum indicating whether or not the user is an endorsed answerer.
 * - `postNotifications`: An array of post notifications associated with the user.
 */
const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String, // URL is a string
      required: false,
    },
    status: {
      type: String,
      enum: ['Not endorsed', 'Endorsed'],
      default: 'Not endorsed', // All users start out in the application as not endorsed
      required: true,
    },
    postNotifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostNotification',
        required: true,
      },
    ],
  },
  { collection: 'User' },
);

export default userSchema;
