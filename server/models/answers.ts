import mongoose, { Model } from 'mongoose';
import answerSchema from './schema/answer';
import { Answer } from '../types';

/**
 * Mongoose model for the `Answer` collection.
 *
 * This model is created using the `Answer` interface and the `answerSchema`, representing the
 * `Answer` collection in the MongoDB database, and provides an interface for interacting with
 * the stored answers.
 *
 * @type {Model<Answer>}
 */
const AnswerModel: Model<Answer> = mongoose.model<Answer>('Answer', answerSchema);

export default AnswerModel;
