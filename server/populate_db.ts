import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import { Answer, Comment, PostNotification, Question, Tag, User } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q5_TXT,
  Q5_DESC,
  Q6_DESC,
  Q6_TXT,
  Q7_DESC,
  Q7_TXT,
  Q8_DESC,
  Q8_TXT,
  Q9_DESC,
  Q9_TXT,
  Q10_DESC,
  Q10_TXT,
  Q11_DESC,
  Q11_TXT,
  Q12_DESC,
  Q12_TXT,
  Q13_DESC,
  Q13_TXT,
  Q14_DESC,
  Q14_TXT,
  Q15_DESC,
  Q15_TXT,
  Q16_DESC,
  Q16_TXT,
  Q17_DESC,
  Q17_TXT,
  Q18_DESC,
  Q18_TXT,
  Q19_DESC,
  Q19_TXT,
  Q20_DESC,
  Q20_TXT,
  Q21_DESC,
  Q21_TXT,
  Q22_DESC,
  Q22_TXT,
  Q23_DESC,
  Q23_TXT,
  Q24_DESC,
  Q24_TXT,
  Q25_DESC,
  Q25_TXT,
  Q26_DESC,
  Q26_TXT,
  Q27_DESC,
  Q27_TXT,
  Q28_DESC,
  Q28_TXT,
  Q29_DESC,
  Q29_TXT,
  Q30_DESC,
  Q30_TXT,
  Q31_DESC,
  Q31_TXT,
  Q32_DESC,
  Q32_TXT,
  Q33_DESC,
  Q33_TXT,
  Q34_DESC,
  Q34_TXT,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  A9_TEXT,
  A10_TEXT,
  A11_TEXT,
  A12_TEXT,
  A13_TEXT,
  A14_TEXT,
  A15_TEXT,
  A16_TEXT,
  A17_TEXT,
  A18_TEXT,
  A19_TEXT,
  A20_TEXT,
  A21_TEXT,
  A22_TEXT,
  A23_TEXT,
  A24_TEXT,
  A25_TEXT,
  A26_TEXT,
  A27_TEXT,
  A28_TEXT,
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
  T7_NAME,
  T7_DESC,
  T8_NAME,
  T8_DESC,
  T9_NAME,
  T9_DESC,
  T10_NAME,
  T10_DESC,
  T11_NAME,
  T11_DESC,
  T12_NAME,
  T12_DESC,
  T13_NAME,
  T13_DESC,
  T14_NAME,
  T14_DESC,
  T15_NAME,
  T15_DESC,
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
  C13_TEXT,
  C14_TEXT,
  C15_TEXT,
  C16_TEXT,
  C17_TEXT,
  C18_TEXT,
  C19_TEXT,
  C20_TEXT,
  C21_TEXT,
  C22_TEXT,
  C23_TEXT,
  C24_TEXT,
  C25_TEXT,
  C26_TEXT,
  C27_TEXT,
  C28_TEXT,
  C29_TEXT,
  C30_TEXT,
  C31_TEXT,
  C32_TEXT,
  C33_TEXT,
  C34_TEXT,
  C35_TEXT,
  C36_TEXT,
  C37_TEXT,
  C38_TEXT,
  C39_TEXT,
  C40_TEXT,
} from './data/posts_strings';
import CommentModel from './models/comments';
import UserModel from './models/user';
import PostNotificationModel from './models/postNotifications';

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
 * @param subscribers The users who have subscribed to the tag.
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string, subscribers: User[]): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description, subscribers: subscribers };
  return await TagModel.create(tag);
}

async function postNotificationCreate(
  title: string,
  text: string,
  notificationType: 'questionAnswered' | 'commentAdded' | 'questionPostedWithTag',
  postId: ObjectId,
  fromUser: User,
): Promise<PostNotification> {
  if (title === '' || text === '' || fromUser.uid === '')
    throw new Error('Invalid PostNotification Format');
  const postNotification: PostNotification = {
    title,
    text,
    notificationType,
    postId,
    fromUser,
  };
  return await PostNotificationModel.create(postNotification);
}

async function userCreate(
  uid: string,
  username: string,
  email: string,
  status: 'Not endorsed' | 'Endorsed' | 'Super Smarty Pants' | 'Mentor' | 'Grandmaster',
  postNotifications: { postNotification: PostNotification; read: boolean }[],
  reputation: number,
  firstName?: string,
  lastName?: string,
  profilePicture?: string,
): Promise<User> {
  if (uid === '') throw new Error('Invalid User Format');
  if (username === '') throw new Error('Invalid username Format');
  if (email === '') throw new Error('Invalid email Format');
  const user: User = {
    uid,
    username,
    email,
    status,
    postNotifications,
    reputation,
    firstName,
    lastName,
    profilePicture,
  };

  // Find the welcome notification in the database
  const welcomeNotification: PostNotification | null = await PostNotificationModel.findOne({
    title: 'Welcome to Fake Stack Overflow!',
    text: 'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter.',
    notificationType: 'questionPostedWithTag',
  });

  // If the welcome notification exists, add it to the user's postNotifications prior to creation
  if (welcomeNotification) {
    user.postNotifications = [
      ...postNotifications,
      { postNotification: welcomeNotification, read: false },
    ];
  }

  // Create the user
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
  subscribers: User[],
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

  const subscribersFromTags = [
    ...new Set<User>(
      tags
        .map(tag => tag.subscribers)
        .flat()
        .filter(
          (subscriber): subscriber is User =>
            typeof subscriber !== 'string' && subscriber instanceof Object,
        ),
    ),
  ];
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
    subscribers: subscribersFromTags.includes(askedBy)
      ? [...subscribers, ...subscribersFromTags]
      : [...subscribers, askedBy, ...subscribersFromTags],
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    // Put the code for the welcome notification at the top so that all
    // subsequent user creations will be populated with the welcome notification

    // Add fake stack overflow team user for welcome notification
    const fakeStackOverflowTeamUser = await userCreate(
      'QyOuDOnKEfMX4vlARweFSGrj9ft1', // From Firebase
      'FakeStackOverflowTeam',
      'FakeStackOverflowTeam@gmail.com',
      'Endorsed',
      [],
      0,
    );

    // Add tag for bogus question that is pointed to by the welcome notification
    const t1 = await tagCreate(T1_NAME, T1_DESC, []);

    // Bogus question posted to the database that is pointed to by the welcome notification
    const fakeStackOverflowWelcomeQuestion = await questionCreate(
      'Welcome to Fake Stack Overflow!',
      'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter.',
      [t1],
      [],
      fakeStackOverflowTeamUser,
      new Date('1776-04-07T03:30:00'),
      [],
      [],
      [],
    );

    if (fakeStackOverflowWelcomeQuestion._id === undefined) {
      throw new Error('Error creating welcome notification; question ID is undefined');
    }

    await postNotificationCreate(
      'Welcome to Fake Stack Overflow!',
      'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter.',
      'questionPostedWithTag',
      fakeStackOverflowWelcomeQuestion._id,
      fakeStackOverflowTeamUser,
    );

    const u1 = await userCreate(
      '1',
      'sana',
      'sana@email.com',
      'Super Smarty Pants',
      [],
      250,
      'Sana',
      'Ali',
      'https://cdn.pixabay.com/photo/2020/09/27/03/38/woman-5605529_640.jpg',
    );
    const u2 = await userCreate(
      '2',
      'ihba001',
      'ihba001@email.com',
      'Not endorsed',
      [],
      10,
      'Ibrahim',
      'Ahmed',
      'https://cdn.pixabay.com/photo/2023/03/17/16/14/silhouette-7858977_640.jpg',
    );
    const u3 = await userCreate(
      '3',
      'saltyPeter',
      'saltyPeter@email.com',
      'Endorsed',
      [],
      35,
      'Peter',
      'Salt',
      'https://cdn.pixabay.com/photo/2016/11/18/15/03/man-1835195_640.jpg',
    );
    const u4 = await userCreate(
      '4',
      'monkeyABC',
      'monkeyABC@email.com',
      'Not endorsed',
      [],
      24,
      'Alice',
      'Brown',
      'https://cdn.pixabay.com/photo/2016/08/01/20/15/girl-1562025_640.jpg',
    );
    const u5 = await userCreate(
      '5',
      'hamkalo',
      'hamkalo@email.com',
      'Endorsed',
      [],
      35,
      'Hamid',
      'Kalo',
      'https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_640.jpg',
    );
    const u6 = await userCreate(
      '6',
      'azad',
      'azad@email.com',
      'Not endorsed',
      [],
      1,
      'Azad',
      'Khan',
      'https://cdn.pixabay.com/photo/2015/06/01/00/20/man-792821_640.jpg',
    );
    const u7 = await userCreate(
      '7',
      'alia',
      'alia@email.com',
      'Mentor',
      [],
      560,
      'Alia',
      'Bhatt',
      'https://cdn.pixabay.com/photo/2016/08/01/20/12/girl-1561979_640.jpg',
    );
    const u8 = await userCreate(
      '8',
      'abhi3241',
      'abhi3241@email.com',
      'Not endorsed',
      [],
      0,
      'Abhishek',
      'Kumar',
      'https://cdn.pixabay.com/photo/2023/08/23/03/33/boxer-8207572_640.jpg',
    );
    const u9 = await userCreate(
      '9',
      'abaya',
      'abaya@email.com',
      'Grandmaster',
      [],
      10000,
      'Abaya',
      'Mohammed',
      'https://cdn.pixabay.com/photo/2016/11/29/02/20/astronomy-1866822_640.jpg',
    );
    const u10 = await userCreate(
      '10',
      'elephantCDE',
      'elephantCDE@email.com',
      'Not endorsed',
      [],
      4,
      'Chandra',
      'Elephant',
      'https://cdn.pixabay.com/photo/2023/09/14/19/46/elephant-8253639_640.jpg',
    );
    const u11 = await userCreate(
      '11',
      'Joji John',
      'Joji_John@email.com',
      'Endorsed',
      [],
      500,
      'Joji',
      'John',
      'https://cdn.pixabay.com/photo/2024/01/07/14/12/man-8493244_640.jpg',
    );
    const u12 = await userCreate(
      '12',
      'techGuru99',
      'techguru99@email.com',
      'Mentor',
      [],
      780,
      'Guru',
      'Tech',
      'https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_640.jpg',
    );
    const u13 = await userCreate(
      '13',
      'codeNinja',
      'codeninja@email.com',
      'Endorsed',
      [],
      320,
      'Nina',
      'Coder',
      'https://cdn.pixabay.com/photo/2017/01/25/10/39/ninja-2007576_1280.jpg',
    );
    const u14 = await userCreate(
      '14',
      'dataWizard',
      'datawizard@email.com',
      'Super Smarty Pants',
      [],
      1200,
      'David',
      'Wizard',
      'https://cdn.pixabay.com/photo/2017/12/27/14/46/wizard-3042838_640.jpg',
    );
    const u15 = await userCreate(
      '15',
      'bugHunter',
      'bughunter@email.com',
      'Not endorsed',
      [],
      50,
      'Hunter',
      'Bug',
      'https://cdn.pixabay.com/photo/2023/11/01/21/15/spider-8359315_640.jpg',
    );
    const u16 = await userCreate(
      '16',
      'cloudMaster',
      'cloudmaster@email.com',
      'Endorsed',
      [],
      420,
      'Claudia',
      'Master',
      'https://cdn.pixabay.com/photo/2022/03/28/10/06/mountain-7097104_640.jpg',
    );
    const u17 = await userCreate(
      '17',
      'aiExpert',
      'aiexpert@email.com',
      'Grandmaster',
      [],
      8500,
      'Alex',
      'Intelligence',
      'https://cdn.pixabay.com/photo/2022/11/30/20/37/animal-7627621_640.jpg',
    );
    const u18 = await userCreate(
      '18',
      'securityPro',
      'securitypro@email.com',
      'Mentor',
      [],
      950,
      'Samantha',
      'Secure',
      'https://cdn.pixabay.com/photo/2015/03/03/18/58/woman-657753_640.jpg',
    );
    const u19 = await userCreate(
      '19',
      'frontEndDev',
      'frontenddev@email.com',
      'Not endorsed',
      [],
      80,
      'Frank',
      'Developer',
      'https://cdn.pixabay.com/photo/2016/05/05/17/59/sports-car-1374425_640.jpg',
    );
    const u20 = await userCreate(
      '20',
      'backEndGuru',
      'backendguru@email.com',
      'Endorsed',
      [],
      550,
      'Barbara',
      'Guru',
      'https://cdn.pixabay.com/photo/2024/11/02/15/31/cat-9169528_1280.jpg',
    );
    const u21 = await userCreate(
      '21',
      'fullStackNinja',
      'fullstackninja@email.com',
      'Super Smarty Pants',
      [],
      1500,
      'Ninja',
      'Fullstack',
      'https://cdn.pixabay.com/photo/2017/11/05/15/44/man-2920911_640.jpg',
    );
    const u22 = await userCreate(
      '22',
      'databaseKing',
      'databaseking@email.com',
      'Mentor',
      [],
      720,
      'Derek',
      'King',
    );
    const u23 = await userCreate(
      '23',
      'mobileAppQueen',
      'mobileappqueen@email.com',
      'Endorsed',
      [],
      480,
      'Monica',
      'Queen',
    );
    const u24 = await userCreate(
      '24',
      'devOpsHero',
      'devopshero@email.com',
      'Not endorsed',
      [],
      150,
      'Hero',
      'DevOps',
    );
    const u25 = await userCreate(
      '25',
      'qaExpert',
      'qaexpert@email.com',
      'Endorsed',
      [],
      380,
      'Quincy',
      'Assurance',
    );
    const u26 = await userCreate(
      '26',
      'blockchainPioneer',
      'blockchainpioneer@email.com',
      'Grandmaster',
      [],
      7200,
      'Bella',
      'Chain',
    );

    const t2 = await tagCreate(T2_NAME, T2_DESC, [u1, u2, u3]);
    const t3 = await tagCreate(T3_NAME, T3_DESC, []);
    const t4 = await tagCreate(T4_NAME, T4_DESC, []);
    const t5 = await tagCreate(T5_NAME, T5_DESC, []);
    const t6 = await tagCreate(T6_NAME, T6_DESC, []);
    const t7 = await tagCreate(T7_NAME, T7_DESC, []);
    const t8 = await tagCreate(T8_NAME, T8_DESC, []);
    const t9 = await tagCreate(T9_NAME, T9_DESC, []);
    const t10 = await tagCreate(T10_NAME, T10_DESC, []);
    const t11 = await tagCreate(T11_NAME, T11_DESC, []);
    const t12 = await tagCreate(T12_NAME, T12_DESC, []);
    const t13 = await tagCreate(T13_NAME, T13_DESC, []);
    const t14 = await tagCreate(T14_NAME, T14_DESC, []);
    const t15 = await tagCreate(T15_NAME, T15_DESC, []);

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
    const c11 = await commentCreate(C11_TEXT, u4, new Date('2023-03-18T01:02:15'));
    const c12 = await commentCreate(C12_TEXT, u7, new Date('2023-04-10T14:28:01'));
    const c13 = await commentCreate(C13_TEXT, u7, new Date('2023-05-15T09:45:30'));
    const c14 = await commentCreate(C14_TEXT, u3, new Date('2023-06-02T14:20:15'));
    const c15 = await commentCreate(C15_TEXT, u11, new Date('2023-06-18T11:30:45'));
    const c16 = await commentCreate(C16_TEXT, u5, new Date('2023-07-01T16:55:22'));
    const c17 = await commentCreate(C17_TEXT, u9, new Date('2023-07-14T08:10:37'));
    const c18 = await commentCreate(C18_TEXT, u2, new Date('2023-07-29T19:05:53'));
    const c19 = await commentCreate(C19_TEXT, u8, new Date('2023-08-11T12:40:18'));
    const c20 = await commentCreate(C20_TEXT, u6, new Date('2023-08-25T07:15:42'));
    const c21 = await commentCreate(C21_TEXT, u10, new Date('2023-09-08T22:30:09'));
    const c22 = await commentCreate(C22_TEXT, u4, new Date('2023-09-21T13:50:34'));
    const c23 = await commentCreate(C23_TEXT, u1, new Date('2023-10-05T10:25:57'));
    const c24 = await commentCreate(C24_TEXT, u12, new Date('2023-10-18T17:40:23'));
    const c25 = await commentCreate(C25_TEXT, u13, new Date('2023-11-01T06:05:48'));
    const c26 = await commentCreate(C26_TEXT, u15, new Date('2023-11-14T20:35:12'));
    const c27 = await commentCreate(C27_TEXT, u18, new Date('2023-11-28T15:00:37'));
    const c28 = await commentCreate(C28_TEXT, u21, new Date('2023-12-11T09:25:01'));
    const c29 = await commentCreate(C29_TEXT, u24, new Date('2023-12-25T18:45:26'));
    const c30 = await commentCreate(C30_TEXT, u26, new Date('2024-01-07T11:10:50'));
    const c31 = await commentCreate(C31_TEXT, u19, new Date('2024-01-21T23:30:15'));
    const c32 = await commentCreate(C32_TEXT, u16, new Date('2024-02-04T14:55:39'));
    const c33 = await commentCreate(C33_TEXT, u22, new Date('2024-02-18T07:20:04'));
    const c34 = await commentCreate(C34_TEXT, u25, new Date('2024-03-03T21:40:28'));
    const c35 = await commentCreate(C35_TEXT, u14, new Date('2024-03-17T16:05:53'));
    const c36 = await commentCreate(C36_TEXT, u20, new Date('2024-03-31T08:30:17'));
    const c37 = await commentCreate(C37_TEXT, u17, new Date('2024-04-14T19:50:42'));
    const c38 = await commentCreate(C38_TEXT, u23, new Date('2024-04-28T12:15:06'));
    const c39 = await commentCreate(C39_TEXT, u26, new Date('2024-05-12T03:35:31'));
    const c40 = await commentCreate(C40_TEXT, u13, new Date('2024-05-26T22:00:55'));

    const a1 = await answerCreate(A1_TXT, u5, new Date('2023-11-20T03:24:42'), [c1]);
    const a2 = await answerCreate(A2_TXT, u6, new Date('2023-11-23T08:24:00'), [c2]);
    const a3 = await answerCreate(A3_TXT, u10, new Date('2023-11-18T09:24:00'), [c3]);
    const a4 = await answerCreate(A4_TXT, u8, new Date('2023-11-12T03:30:00'), [c4]);
    const a5 = await answerCreate(A5_TXT, u1, new Date('2023-11-01T15:24:19'), [c5]);
    const a6 = await answerCreate(A6_TXT, u9, new Date('2023-02-19T18:20:59'), [c6]);
    const a7 = await answerCreate(A7_TXT, u9, new Date('2023-02-22T17:19:00'), [c7]);
    const a8 = await answerCreate(A8_TXT, u2, new Date('2023-03-22T21:17:53'), [c8]);
    const a9 = await answerCreate(A9_TEXT, u3, new Date('2023-04-15T10:30:00'), [c9]);
    const a10 = await answerCreate(A10_TEXT, u7, new Date('2023-05-20T14:45:00'), [c10]);
    const a11 = await answerCreate(A11_TEXT, u11, new Date('2023-06-25T09:15:00'), [c11]);
    const a12 = await answerCreate(A12_TEXT, u13, new Date('2023-07-30T16:20:00'), [c12]);
    const a13 = await answerCreate(A13_TEXT, u15, new Date('2023-08-05T11:40:00'), [c13]);
    const a14 = await answerCreate(A14_TEXT, u17, new Date('2023-09-10T13:55:00'), [c14]);
    const a15 = await answerCreate(A15_TEXT, u19, new Date('2023-10-15T08:30:00'), [c15]);
    const a16 = await answerCreate(A16_TEXT, u21, new Date('2023-11-20T17:25:00'), [c16]);
    const a17 = await answerCreate(A17_TEXT, u23, new Date('2023-12-25T12:10:00'), [c17]);
    const a18 = await answerCreate(A18_TEXT, u25, new Date('2024-01-30T15:45:00'), [c18]);
    const a19 = await answerCreate(A19_TEXT, u2, new Date('2024-02-05T09:20:00'), [c19]);
    const a20 = await answerCreate(A20_TEXT, u4, new Date('2024-03-10T14:35:00'), [c20]);
    const a21 = await answerCreate(A21_TEXT, u6, new Date('2024-04-15T11:50:00'), [c21]);
    const a22 = await answerCreate(A22_TEXT, u8, new Date('2024-05-20T16:05:00'), [c22]);
    const a23 = await answerCreate(A23_TEXT, u10, new Date('2024-06-25T11:20:00'), [c23]);
    const a24 = await answerCreate(A24_TEXT, u12, new Date('2024-07-30T14:45:00'), [c24]);
    const a25 = await answerCreate(A25_TEXT, u14, new Date('2024-08-05T09:10:00'), [c25]);
    const a26 = await answerCreate(A26_TEXT, u16, new Date('2024-09-10T15:35:00'), [c26]);
    const a27 = await answerCreate(A27_TEXT, u18, new Date('2024-10-15T08:50:00'), [c27]);
    const a28 = await answerCreate(A28_TEXT, u20, new Date('2024-11-20T17:15:00'), [c28]);

    const q1 = await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      u10,
      new Date('2022-01-20T03:00:00'),
      ['sana', 'abaya', 'alia'],
      [c9],
      [u2, u4],
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
      [],
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
      [u8, u5],
    );
    await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      u11,
      new Date('2023-03-10T14:28:01'),
      [],
      [c12],
      [u9, u11],
    );
    await questionCreate(
      Q5_DESC,
      Q5_TXT,
      [t9, t14],
      [a9, a10],
      u7,
      new Date('2023-04-15T09:30:00'),
      ['techGuru99', 'codeNinja'],
      [c13],
      [u12, u13],
    );

    await questionCreate(
      Q6_DESC,
      Q6_TXT,
      [t1, t2],
      [a11],
      u14,
      new Date('2023-05-20T16:45:00'),
      ['dataWizard', 'bugHunter'],
      [c14],
      [u15, u16],
    );

    await questionCreate(
      Q7_DESC,
      Q7_TXT,
      [t7, t14],
      [a12, a13],
      u17,
      new Date('2023-06-25T11:15:00'),
      ['aiExpert', 'securityPro'],
      [c15],
      [u18, u19],
    );

    await questionCreate(
      Q8_DESC,
      Q8_TXT,
      [t10, t14],
      [a14],
      u20,
      new Date('2023-07-30T14:20:00'),
      ['backEndGuru', 'fullStackNinja'],
      [c16],
      [u21, u22],
    );

    await questionCreate(
      Q9_DESC,
      Q9_TXT,
      [t1, t3],
      [a15, a16],
      u23,
      new Date('2023-08-05T10:40:00'),
      ['mobileAppQueen', 'devOpsHero'],
      [c17],
      [u24, u25],
    );

    await questionCreate(
      Q10_DESC,
      Q10_TXT,
      [t9, t14],
      [a17],
      u26,
      new Date('2023-09-10T15:55:00'),
      ['blockchainPioneer', 'sana'],
      [c18],
      [u1, u2],
    );

    await questionCreate(
      Q11_DESC,
      Q11_TXT,
      [t12, t9],
      [a18],
      u3,
      new Date('2023-10-15T08:30:00'),
      ['ihba001', 'saltyPeter'],
      [c19],
      [u4, u5],
    );

    await questionCreate(
      Q12_DESC,
      Q12_TXT,
      [t9, t14],
      [a19, a20],
      u6,
      new Date('2023-11-20T17:25:00'),
      ['azad', 'alia'],
      [c20],
      [u7, u8],
    );

    await questionCreate(
      Q13_DESC,
      Q13_TXT,
      [t1, t2, t15],
      [a21],
      u9,
      new Date('2023-12-25T12:10:00'),
      ['abaya', 'elephantCDE'],
      [c21],
      [u10, u11],
    );

    await questionCreate(
      Q14_DESC,
      Q14_TXT,
      [t9, t14],
      [a22],
      u12,
      new Date('2024-01-30T15:45:00'),
      ['techGuru99', 'codeNinja'],
      [c22],
      [u13, u14],
    );

    await questionCreate(
      Q15_DESC,
      Q15_TXT,
      [t10, t14],
      [a23, a24],
      u15,
      new Date('2024-02-05T09:20:00'),
      ['bugHunter', 'cloudMaster'],
      [c23],
      [u16, u17],
    );

    await questionCreate(
      Q16_DESC,
      Q16_TXT,
      [t13, t14],
      [a25],
      u18,
      new Date('2024-03-10T14:35:00'),
      ['aiExpert', 'securityPro'],
      [c24],
      [u19, u20],
    );

    await questionCreate(
      Q17_DESC,
      Q17_TXT,
      [t9, t14],
      [a26, a27],
      u21,
      new Date('2024-04-15T11:50:00'),
      ['fullStackNinja', 'databaseKing'],
      [c25],
      [u22, u23],
    );

    await questionCreate(
      Q18_DESC,
      Q18_TXT,
      [t1, t9],
      [a28],
      u24,
      new Date('2024-05-20T16:05:00'),
      ['devOpsHero', 'qaExpert'],
      [c26],
      [u25, u26],
    );

    await questionCreate(
      Q19_DESC,
      Q19_TXT,
      [t9, t14],
      [],
      u1,
      new Date('2024-06-25T10:20:00'),
      ['sana', 'ihba001'],
      [c27],
      [u2, u3],
    );

    await questionCreate(
      Q20_DESC,
      Q20_TXT,
      [t9, t12],
      [],
      u4,
      new Date('2024-07-30T15:35:00'),
      ['monkeyABC', 'hamkalo'],
      [c28],
      [u5, u6],
    );

    await questionCreate(
      Q21_DESC,
      Q21_TXT,
      [t1, t3],
      [],
      u7,
      new Date('2024-08-05T09:50:00'),
      ['alia', 'abhi3241'],
      [c29],
      [u8, u9],
    );

    await questionCreate(
      Q22_DESC,
      Q22_TXT,
      [t11, t12],
      [],
      u10,
      new Date('2024-09-10T14:05:00'),
      ['elephantCDE', 'Joji John'],
      [c30],
      [u11, u12],
    );

    await questionCreate(
      Q23_DESC,
      Q23_TXT,
      [t9, t14],
      [],
      u13,
      new Date('2024-10-15T08:20:00'),
      ['codeNinja', 'dataWizard'],
      [c31],
      [u14, u15],
    );

    await questionCreate(
      Q24_DESC,
      Q24_TXT,
      [t9, t14],
      [],
      u16,
      new Date('2024-11-20T13:35:00'),
      ['cloudMaster', 'aiExpert'],
      [c32],
      [u17, u18],
    );

    await questionCreate(
      Q25_DESC,
      Q25_TXT,
      [t8, t14],
      [],
      u19,
      new Date('2024-12-25T07:50:00'),
      ['frontEndDev', 'backEndGuru'],
      [c33],
      [u20, u21],
    );

    await questionCreate(
      Q26_DESC,
      Q26_TXT,
      [t10, t14],
      [],
      u22,
      new Date('2025-01-30T12:05:00'),
      ['databaseKing', 'mobileAppQueen'],
      [c34],
      [u23, u24],
    );

    await questionCreate(
      Q27_DESC,
      Q27_TXT,
      [t7, t9],
      [],
      u25,
      new Date('2025-02-05T16:20:00'),
      ['qaExpert', 'blockchainPioneer'],
      [c35],
      [u26, u1],
    );

    await questionCreate(
      Q28_DESC,
      Q28_TXT,
      [t9, t14],
      [],
      u2,
      new Date('2025-03-10T10:35:00'),
      ['ihba001', 'saltyPeter'],
      [c36],
      [u3, u4],
    );

    await questionCreate(
      Q29_DESC,
      Q29_TXT,
      [t9, t14],
      [],
      u5,
      new Date('2025-04-15T15:50:00'),
      ['hamkalo', 'azad'],
      [c37],
      [u6, u7],
    );

    await questionCreate(
      Q30_DESC,
      Q30_TXT,
      [t1, t14],
      [],
      u8,
      new Date('2025-05-20T09:05:00'),
      ['abhi3241', 'abaya'],
      [c38],
      [u9, u10],
    );

    await questionCreate(
      Q31_DESC,
      Q31_TXT,
      [t10, t14],
      [],
      u11,
      new Date('2025-06-25T14:20:00'),
      ['Joji John', 'techGuru99'],
      [c39],
      [u12, u13],
    );

    await questionCreate(
      Q32_DESC,
      Q32_TXT,
      [t13, t14],
      [],
      u14,
      new Date('2025-07-30T08:35:00'),
      ['dataWizard', 'bugHunter'],
      [c40],
      [u15, u16],
    );

    await questionCreate(
      Q33_DESC,
      Q33_TXT,
      [t1, t15],
      [],
      u17,
      new Date('2025-08-05T13:50:00'),
      ['aiExpert', 'securityPro'],
      [],
      [u18, u19],
    );

    await questionCreate(
      Q34_DESC,
      Q34_TXT,
      [t9, t12],
      [],
      u20,
      new Date('2025-09-10T07:05:00'),
      ['backEndGuru', 'fullStackNinja'],
      [],
      [u21, u22],
    );

    // Test user
    await userCreate(
      '6kULi0D0G7ZDp1XRn7XnjQZ6Ckk2', // From Firebase
      'test',
      'test@gmail.com',
      'Not endorsed',
      [],
      0,
      'test',
      'test',
      '',
    );

    // Adding us as a users
    await userCreate(
      'LSF2vgdlbyVFpDd6KmbBs7Fwa5O2', // From Firebase
      'jekhi5',
      'jacobk513@gmail.com',
      'Not endorsed',
      [],
      13,
      'Jacob',
      'Kline',
      '',
    );

    await userCreate(
      'Fm5O8RAHjqcxmNrip3luw0JF6mz1',
      'yashleydaviis',
      'ashley921davis@gmail.com',
      'Grandmaster',
      [],
      15000,
      'Ashley',
      'Davis',
      'https://cdn.pixabay.com/photo/2024/02/23/23/58/dog-8593014_1280.jpg',
    );

    await userCreate(
      'NZn2s5RwTvPn9VsmlgBRRswvy5J2',
      'kenhen',
      'kennethhenneth@gmail.com',
      'Not endorsed',
      [],
      20,
      'Kenneth',
      'Borrero',
      '',
    );

    await userCreate(
      '1LHJdANB6bXmgh1aDks2o8pWCJ22',
      'grace',
      'gracelyntheobald@gmail.com',
      'Super Smarty Pants',
      [],
      100,
      'Gracelyn',
      'Theobald',
      '',
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
