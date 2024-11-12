import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Question, User } from '../types';

const toggleSubscriberSpy = jest.spyOn(util, 'toggleSubscribe');
const popDocSpy = jest.spyOn(util, 'populateDocument');

const user1: User = {
  uid: 'ab53191e810c19729de860ea',
  username: 'user1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

const user2: User = {
  uid: 'ab531bcf520c19729de860ea',
  username: 'user2',
  email: 'user2@email.com',
  status: 'Not endorsed',
  postNotifications: [],
};

describe('POST /toggleSubscribe', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new subscriber to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      user: user2,
    };

    toggleSubscriberSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: user1,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      subscribers: [user2],
    } as Question);

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: user1,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      subscribers: [user2],
    });

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validQid.toString(),
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: user1,
      askDateTime: '2024-06-03T00:00:00.000Z',
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [],
      subscribers: [user2],
    });
  });

  it('should return bad request error if id property missing', async () => {
    const mockReqBody = {
      user: user2,
    };

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if user property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
    };

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });
});
