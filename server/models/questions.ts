// Question Document Schema
import mongoose, { Model } from 'mongoose';
import questionSchema from './schema/question';
import { Question } from '../types';

/**
 * Mongoose model for the `Question` collection.
 *
 * This model is created using the `Question` interface and the `questionSchema`, representing the
 * `Question` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<Question>}
 */
const QuestionModel: Model<Question> = mongoose.model<Question>('Question', questionSchema);

export default QuestionModel;
