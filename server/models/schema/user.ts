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
 * - `postNotifications`: An array of post notifications associated with the user.
 */
const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
      enum: ['Not endorsed', 'Endorsed', 'Super Smarty Pants', 'Mentor', 'Grandmaster'],
      default: 'Not endorsed', // All users start out in the application as not endorsed
      required: true,
    },
    postNotifications: [
      {
        postNotification: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PostNotification',
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    reputation: {
      type: Number,
      default: 0,
      required: true,
    },
    emailsEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { collection: 'User' },
);

/**
 * Mongo equivalent of a MYSQL trigger.
 * Updates the status of a user to 'Endorsed' if their reputation is 30 or higher.
 * Adds the welcome notification to the user's postNotifications array.
 */
userSchema.post('findOneAndUpdate', async doc => {
  // Update status based on points
  if (doc.points >= 30 && doc.points < 100 && doc.status !== 'Endorsed') {
    doc.status = 'Endorsed';
  } else if (doc.points >= 100 && doc.points < 500 && doc.status !== 'Super Smarty Pants') {
    doc.status = 'Super Smarty Pants';
  } else if (doc.points >= 500 && doc.points < 1000 && doc.status !== 'Mentor') {
    doc.status = 'Mentor';
  } else if (doc.points >= 1000 && doc.status !== 'Grandmaster') {
    doc.status = 'Grandmaster';
  }
  await doc.save();
});

export default userSchema;
