import supertest from 'supertest';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, PostNotification, Question, Tag, User, Comment } from '../types';

const fetchNotificationsByUidSpy: jest.SpyInstance = jest.spyOn(util, 'fetchNotificationsByUid');

const answer1User: User = {
  uid: 'ab53191e810c19729de860ea',
  username: 'Answer1User',
  email: 'answer1User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const answer2User: User = {
  uid: 'ab531bcf520c19729de860ea',
  username: 'Answer2User',
  email: 'answer2User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const answer3User: User = {
  uid: 'ab53191e810c197aaae860ea',
  username: 'Answer3User',
  email: 'answer3User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const answer4User: User = {
  uid: 'ab51234e810c19729de860ea',
  username: 'Answer4User',
  email: 'answer4User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const question1User: User = {
  uid: 'ab51234e810c19729deef0ea',
  username: 'Question1User',
  email: 'question1User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const question2User: User = {
  uid: 'ab5123abc10c19729deef0ea',
  username: 'Question2User',
  email: 'question2User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const question3User: User = {
  uid: 'ab51234e867c19729deef0ea',
  username: 'Question3User',
  email: 'question3User@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
  description: 'tag2 description',
};

const ans1: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'Answer 1 Text',
  ansBy: answer1User,
  ansDateTime: new Date('2024-06-09'), // The mock date is string type but in the actual implementation it is a Date type
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans2: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'Answer 2 Text',
  ansBy: answer2User,
  ansDateTime: new Date('2024-06-10'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans3: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'Answer 3 Text',
  ansBy: answer3User,
  ansDateTime: new Date('2024-06-11'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans4: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'Answer 4 Text',
  ansBy: answer4User,
  ansDateTime: new Date('2024-06-14'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const MOCK_QUESTIONS: Question[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    askedBy: question1User,
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    askedBy: question2User,
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new mongoose.Types.ObjectId('34e9b58910afe6e94fc6e99f'),
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    askedBy: question3User,
    askDateTime: new Date('2024-06-03'),
    views: ['question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
];

const com1: Comment = {
  _id: new mongoose.Types.ObjectId('65e9b716ff0e89abc6b2de01'),
  text: 'com1',
  commentBy: question3User,
  commentDateTime: new Date('2023-11-18T09:25:00'),
  upVotes: [],
  downVotes: [],
};

const answerNotification: PostNotification = {
  _id: new ObjectId('65e9b716ff0e892116b2de01'),
  title: 'New Answer',
  text: 'User1 answered your question',
  postType: 'Answer',
  postId: ans1._id ?? new mongoose.Types.ObjectId(),
  fromUser: answer1User,
};

const commentNotification: PostNotification = {
  _id: new ObjectId('65e9b716ff0e892116b2de02'),
  title: 'New Comment',
  text: 'User2 commented on your answer',
  postType: 'Comment',
  postId: com1._id ?? new mongoose.Types.ObjectId(),
  fromUser: question2User,
};

const questionNotification: PostNotification = {
  _id: new ObjectId('65e9b716ff0e892116b2de03'),
  title: 'New Question',
  text: "User2 posted a new question with a tag you're subscribed to",
  postType: 'Question',
  postId: MOCK_QUESTIONS[0]._id ?? new mongoose.Types.ObjectId(),
  fromUser: question2User,
};

const notificationHavingUser1: User = {
  uid: 'ab53191e810abc729de860ea',
  username: 'notificationHavingUser1',
  email: 'notificationHavingUser1@email.com',
  status: 'Not endorsed',
  postNotifications: [answerNotification, commentNotification],
};

describe('GET /getNotificationsByUid/:uid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the notifications when found', async () => {
    fetchNotificationsByUidSpy.mockResolvedValueOnce(
      notificationHavingUser1.postNotifications as PostNotification[],
    );

    const response = await supertest(app).get(
      `/notification/getNotificationsByUid/${notificationHavingUser1.uid}`,
    );

    const expectedResponse = [
      { ...answerNotification, _id: answerNotification._id?.toJSON(), postId: ans1._id?.toJSON() },
      {
        ...commentNotification,
        _id: commentNotification._id?.toJSON(),
        postId: com1._id?.toJSON(),
      },
    ];

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return error object when uid is bad', async () => {
    fetchNotificationsByUidSpy.mockResolvedValueOnce({
      error: 'Error while fetching notifications',
    });

    const response = await supertest(app).get('/notification/getNotificationsByUid/bad_uid');

    expect(response.status).toBe(500);
  });
});
