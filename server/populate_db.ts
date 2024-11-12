import mongoose from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import { Answer, Comment, Question, Tag, User } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  T1_NAME,
  T1_DESC,
  T2_NAME,
  T2_DESC,
  T3_NAME,
  T3_DESC,
  T4_NAME,
  T4_DESC,
  T5_NAME,
  T5_DESC,
  T6_NAME,
  T6_DESC,
  C1_TEXT,
  C2_TEXT,
  C3_TEXT,
  C4_TEXT,
  C5_TEXT,
  C6_TEXT,
  C7_TEXT,
  C8_TEXT,
  C9_TEXT,
  C10_TEXT,
  C11_TEXT,
  C12_TEXT,
} from './data/posts_strings';
import CommentModel from './models/comments';
import UserModel from './models/user';

// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Creates a new Tag document in the database.
 *
 * @param name The name of the tag.
 * @param description The description of the tag
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string, subscribers: User[]): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description, subscribers: subscribers };
  return await TagModel.create(tag);
}

async function userCreate(
  uid: string,
  username: string,
  email: string,
  status: 'Not endorsed' | 'Endorsed',
): Promise<User> {
  if (uid === '') throw new Error('Invalid User Format');
  if (username === '') throw new Error('Invalid username Format');
  if (email === '') throw new Error('Invalid email Format');
  const user: User = { uid, username, email, status };
  return await UserModel.create(user);
}

/**
 * Creates a new Comment document in the database.
 *
 * @param text The content of the comment.
 * @param commentBy The user who commented.
 * @param commentDateTime The date and time when the comment was posted.
 * @returns A Promise that resolves to the created Comment document.
 * @throws An error if any of the parameters are invalid.
 */
async function commentCreate(
  text: string,
  commentBy: User,
  commentDateTime: Date,
): Promise<Comment> {
  if (text === '' || commentBy.uid === '' || commentDateTime == null)
    throw new Error('Invalid Comment Format');
  const commentDetail: Comment = {
    text: text,
    commentBy: commentBy,
    commentDateTime: commentDateTime,
    upVotes: [],
    downVotes: [],
  };
  return await CommentModel.create(commentDetail);
}

/**
 * Creates a new Answer document in the database.
 *
 * @param text The content of the answer.
 * @param ansBy The user who wrote the answer.
 * @param ansDateTime The date and time when the answer was created.
 * @param comments The comments that have been added to the answer.
 * @returns A Promise that resolves to the created Answer document.
 * @throws An error if any of the parameters are invalid.
 */
async function answerCreate(
  text: string,
  ansBy: User,
  ansDateTime: Date,
  comments: Comment[],
): Promise<Answer> {
  if (text === '' || ansBy.uid === '' || ansDateTime == null || comments == null)
    throw new Error('Invalid Answer Format');
  const answerDetail: Answer = {
    text: text,
    ansBy: ansBy,
    ansDateTime: ansDateTime,
    comments: comments,
    upVotes: [],
    downVotes: [],
  };
  return await AnswerModel.create(answerDetail);
}

/**
 * Creates a new Question document in the database.
 *
 * @param title The title of the question.
 * @param text The content of the question.
 * @param tags An array of tags associated with the question.
 * @param answers An array of answers associated with the question.
 * @param askedBy The username of the user who asked the question.
 * @param askDateTime The date and time when the question was asked.
 * @param views An array of usernames who have viewed the question.
 * @param comments An array of comments associated with the question.
 * @returns A Promise that resolves to the created Question document.
 * @throws An error if any of the parameters are invalid.
 */
async function questionCreate(
  title: string,
  text: string,
  tags: Tag[],
  answers: Answer[],
  askedBy: User,
  askDateTime: Date,
  views: string[],
  comments: Comment[],
): Promise<Question> {
  if (
    title === '' ||
    text === '' ||
    tags.length === 0 ||
    askedBy.uid === '' ||
    askDateTime == null ||
    comments == null
  )
    throw new Error('Invalid Question Format');
  const questionDetail: Question = {
    title: title,
    text: text,
    tags: tags,
    askedBy: askedBy,
    answers: answers,
    views: views,
    askDateTime: askDateTime,
    upVotes: [],
    downVotes: [],
    comments: comments,
    subscribers: [],
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    const u1 = await userCreate('1', 'sana', 'sana@email.com', 'Endorsed');
    const u2 = await userCreate('2', 'ihba001', 'ihba001@email.com', 'Not endorsed');
    const u3 = await userCreate('3', 'saltyPeter', 'saltyPeter@email.com', 'Endorsed');
    const u4 = await userCreate('4', 'monkeyABC', 'monkeyABC@email.com', 'Not endorsed');
    const u5 = await userCreate('5', 'hamkalo', 'hamkalo@email.com', 'Endorsed');
    const u6 = await userCreate('6', 'azad', 'azad@email.com', 'Not endorsed');
    const u8 = await userCreate('7', 'alia', 'alia@email.com', 'Endorsed');
    const u9 = await userCreate('8', 'abhi3241', 'abhi3241@email.com', 'Not endorsed');
    const u10 = await userCreate('9', 'Joji John', 'Joji_John@email.com', 'Endorsed');
    const u11 = await userCreate('10', 'abaya', 'abaya@email.com', 'Not endorsed');
    const u12 = await userCreate('11', 'mackson3332', 'mackson3332@email.com', 'Endorsed');
    const u13 = await userCreate('12', 'elephantCDE', 'elephantCDE@email.com', 'Not endorsed');

    const t1 = await tagCreate(T1_NAME, T1_DESC, [u1, u2, u3]);
    const t2 = await tagCreate(T2_NAME, T2_DESC, []);
    const t3 = await tagCreate(T3_NAME, T3_DESC, [u4, u5]);
    const t4 = await tagCreate(T4_NAME, T4_DESC, [u6, u8]);
    const t5 = await tagCreate(T5_NAME, T5_DESC, []);
    const t6 = await tagCreate(T6_NAME, T6_DESC, []);

    const c1 = await commentCreate(C1_TEXT, u1, new Date('2023-12-12T03:30:00'));
    const c2 = await commentCreate(C2_TEXT, u2, new Date('2023-12-01T15:24:19'));
    const c3 = await commentCreate(C3_TEXT, u3, new Date('2023-12-18T09:24:00'));
    const c4 = await commentCreate(C4_TEXT, u4, new Date('2023-12-20T03:24:42'));
    const c5 = await commentCreate(C5_TEXT, u5, new Date('2023-12-23T08:24:00'));
    const c6 = await commentCreate(C6_TEXT, u6, new Date('2023-12-22T17:19:00'));
    const c7 = await commentCreate(C7_TEXT, u5, new Date('2023-12-22T21:17:53'));
    const c8 = await commentCreate(C8_TEXT, u8, new Date('2023-12-19T18:20:59'));
    const c9 = await commentCreate(C9_TEXT, u2, new Date('2022-02-20T03:00:00'));
    const c10 = await commentCreate(C10_TEXT, u9, new Date('2023-02-10T11:24:30'));
    const c11 = await commentCreate(C11_TEXT, u10, new Date('2023-03-18T01:02:15'));
    const c12 = await commentCreate(C12_TEXT, u11, new Date('2023-04-10T14:28:01'));

    const a1 = await answerCreate(A1_TXT, u5, new Date('2023-11-20T03:24:42'), [c1]);
    const a2 = await answerCreate(A2_TXT, u6, new Date('2023-11-23T08:24:00'), [c2]);
    const a3 = await answerCreate(A3_TXT, u11, new Date('2023-11-18T09:24:00'), [c3]);
    const a4 = await answerCreate(A4_TXT, u8, new Date('2023-11-12T03:30:00'), [c4]);
    const a5 = await answerCreate(A5_TXT, u1, new Date('2023-11-01T15:24:19'), [c5]);
    const a6 = await answerCreate(A6_TXT, u9, new Date('2023-02-19T18:20:59'), [c6]);
    const a7 = await answerCreate(A7_TXT, u12, new Date('2023-02-22T17:19:00'), [c7]);
    const a8 = await answerCreate(A8_TXT, u2, new Date('2023-03-22T21:17:53'), [c8]);

    await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      u10,
      new Date('2022-01-20T03:00:00'),
      ['sana', 'abaya', 'alia'],
      [c9],
    );
    await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [a3, a4, a5],
      u3,
      new Date('2023-01-10T11:24:30'),
      ['mackson3332'],
      [c10],
    );
    await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [a6, a7],
      u4,
      new Date('2023-02-18T01:02:15'),
      ['monkeyABC', 'elephantCDE'],
      [c11],
    );
    await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      u13,
      new Date('2023-03-10T14:28:01'),
      [],
      [c12],
    );

    console.log('Database populated');
  } catch (err) {
    console.log('ERROR: ' + err);
  } finally {
    if (db) db.close();
    console.log('done');
  }
};

populate();

console.log('Processing ...');
