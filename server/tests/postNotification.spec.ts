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

const ans1: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'Answer 1 Text',
  ansBy: answer1User,
  ansDateTime: new Date('2024-06-09'), // The mock date is string type but in the actual implementation it is a Date type
  upVotes: [],
  downVotes: [],
  comments: [],
};

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
