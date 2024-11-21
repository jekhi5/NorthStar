import supertest from 'supertest';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { PostNotification, User } from '../types';

const updateNotificationReadStatusSpy = jest.spyOn(util, 'updateNotificationReadStatus');

const user1: User = {
  uid: 'ab53191e810c19729de860ea',
  username: 'User1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1',
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ansBy: user1,
  ansDateTime: '2024-06-09',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const mockQuestion = {
  _id: new ObjectId(),
  title: 'Question 1 Title',
  text: 'Question 1 Text',
  tags: [tag1],
  answers: [ans1],
  askedBy: user1,
  askDateTime: new Date('2024-06-03'),
  views: ['question1_user'],
  upVotes: [],
  downVotes: [],
  comments: [],
  subscribers: [],
};

const mockNotification: PostNotification = {
  _id: new ObjectId(),
  notificationType: 'questionAnswered',
  title: 'Mock Notification',
  text: 'Mock Notification Text',
  postId: mockQuestion._id,
  fromUser: user1,
};

const user2: User = {
  uid: 'ab531234510c19729de860ea',
  username: 'User2',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [{ postNotification: mockNotification, read: false }],
  reputation: 0,
};

describe('PUT /postNotification/markAsRead', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should mark a post notification as read appropriately', async () => {
    const req = {
      uid: user2.uid,
      postNotificationId: mockNotification._id,
    };

    updateNotificationReadStatusSpy.mockResolvedValue({
      ...user2,
      postNotifications: [{ postNotification: mockNotification, read: true }],
    });

    const res = await supertest(app).put('/postNotification/markAsRead').send(req);

    expect(res.status).toBe(200);
  });

  it('should return a 400 status if the request is missing postNotificationId', async () => {
    const req = {
      uid: user2.uid,
    };

    const res = await supertest(app).put('/postNotification/markAsRead').send(req);

    expect(res.status).toBe(400);
  });

  it('should return a 400 status if the request is missing uid', async () => {
    const req = {
      postNotificationId: mockNotification._id,
    };

    const res = await supertest(app).put('/postNotification/markAsRead').send(req);

    expect(res.status).toBe(400);
  });

  it('should return a 500 status if an error occurs while updating the notification read status', async () => {
    const req = {
      uid: user2.uid,
      postNotificationId: mockNotification._id,
    };

    updateNotificationReadStatusSpy.mockResolvedValueOnce({
      error: 'Error updating notification read status',
    });

    const res = await supertest(app).put('/postNotification/markAsRead').send(req);

    expect(res.status).toBe(500);
  });
});
