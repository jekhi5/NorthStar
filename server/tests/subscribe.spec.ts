import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
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
  reputation: 0,
  emailsEnabled: false,
};

const user2: User = {
  uid: 'ab531bcf520c19729de860ea',
  username: 'user2',
  email: 'user2@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
  emailsEnabled: false,
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
      type: 'question',
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

  it('should return bad request error if id is not a valid ObjectId', async () => {
    const mockReqBody = {
      id: 'invalidId',
      user: user2,
    };

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return bad request error if type is not question or tag', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid,
      type: 'invalidType',
      user: user2,
    };

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid type');
  });

  it('should return bad request error if user is invalid', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: new ObjectId(validQid),
      type: 'question',
      user: { username: 'user2' },
    };

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return internal server error if toggleSubscribe throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: new ObjectId(validQid),
      type: 'question',
      user: user2,
    };

    toggleSubscriberSpy.mockResolvedValueOnce({ error: 'Error when adding subscriber' });

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return internal server error if populateDocument throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: new ObjectId(validQid),
      type: 'question',
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

    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return internal server error if populatedDoc is not a valid QuestionResponse', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: new ObjectId(validQid),
      type: 'question',
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
      error: 'Populated document is not a valid QuestionResponse',
    });

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return internal server error if populatedDoc is not a valid QuestionResponse', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: new ObjectId(validQid),
      type: 'question',
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

    popDocSpy.mockResolvedValueOnce({ something: 'NotAQuestion' } as unknown as Question);

    const response = await supertest(app).post('/subscribe/toggleSubscribe').send(mockReqBody);

    expect(response.status).toBe(500);
  });
});
