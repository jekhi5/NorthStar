import mongoose from 'mongoose';

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
    reputation: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { collection: 'User' },
);

/**
 * Mongo equivalent of a MYSQL trigger.
 * Updates the status of a user to 'Endorsed' if their reputation is 30 or higher.
 */
// eslint-disable-next-line func-names
userSchema.post('findOneAndUpdate', async doc => {
  if (doc.reputation >= 30 && doc.status !== 'Endorsed') {
    doc.status = 'Endorsed';
    await doc.save();
  }
});

export default userSchema;
