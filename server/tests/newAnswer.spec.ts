import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { PostNotification, User } from '../types';

const saveAnswerSpy = jest.spyOn(util, 'saveAnswer');
const addAnswerToQuestionSpy = jest.spyOn(util, 'addAnswerToQuestion');
const addVoteToAnswerSpy = jest.spyOn(util, 'addVoteToAnswer');
const popDocSpy = jest.spyOn(util, 'populateDocument');
const postNotificationSpy = jest.spyOn(util, 'postNotifications');

const user1: User = {
  uid: 'ab531234510c19729de860ea',
  username: 'User1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
  emailsEnabled: false,
};

interface MockResponse {
  msg: string;
  upVotes: string[];
  downVotes: string[];
}

describe('POST /addAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new answer to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: user1,
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: user1,
      ansDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
      comments: [],
    };

    postNotificationSpy.mockResolvedValueOnce([]);

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: user1,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
      subscribers: [],
    });

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
      answers: [mockAnswer],
      comments: [],
      subscribers: [],
    });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: user1,
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      upVotes: [],
      downVotes: [],
      comments: [],
    });
  });

  it('should return bad request error if answer text property is missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid answer');
  });

  it('should return bad request error if request body has qid property missing', async () => {
    const mockReqBody = {
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansBy property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansDateTime property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/answer/addAnswer');

    expect(response.status).toBe(400);
  });

  it('should return database error in response if saveAnswer method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    saveAnswerSpy.mockResolvedValueOnce({ error: 'Error when saving an answer' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if update question method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: user1,
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: user1,
      ansDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce({ error: 'Error when adding answer to question' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: user1,
      ansDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
      comments: [],
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: user1,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
      subscribers: [],
    };

    const mockNotification: PostNotification = {
      _id: new ObjectId(),
      title: 'Mock Notification',
      text: 'This is a mock notification',
      notificationType: 'questionPostedWithTag',
      postId: mockQuestion._id,
      fromUser: user1,
    };

    postNotificationSpy.mockResolvedValueOnce([]);
    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should add a new answer to the question, even if posting the notifications fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: user1,
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: user1,
      ansDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
      comments: [],
    };

    postNotificationSpy.mockResolvedValueOnce([]);

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: user1,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
      subscribers: [],
    });

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
      answers: [mockAnswer],
      comments: [],
      subscribers: [],
    });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: user1,
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      upVotes: [],
      downVotes: [],
      comments: [],
    });
  });
});

describe('POST /upvoteAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should upvote a answer successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      uid: user1.uid,
    };

    const mockResponse = {
      msg: 'Answer upvoted successfully',
      upVotes: [user1.uid],
      downVotes: [],
    };

    addVoteToAnswerSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/answer/upvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should cancel the upvote successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      uid: user1.uid,
    };

    const mockSecondResponse = {
      msg: 'Upvote cancelled successfully',
      upVotes: [],
      downVotes: [],
    };

    await supertest(app).post('/answer/upvoteAnswer').send(mockReqBody);

    addVoteToAnswerSpy.mockResolvedValueOnce(mockSecondResponse);

    const response = await supertest(app).post('/answer/upvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSecondResponse);
  });

  it('should handle upvote and then downvote by the same user', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      uid: user1.uid,
    };

    // First upvote the answer
    let mockResponseWithBothVotes: MockResponse = {
      msg: 'Answer upvoted successfully',
      upVotes: [user1.uid],
      downVotes: [],
    };

    addVoteToAnswerSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    let response = await supertest(app).post('/answer/upvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);

    // Now downvote the answer
    mockResponseWithBothVotes = {
      msg: 'Answer downvoted successfully',
      downVotes: [user1.uid],
      upVotes: [],
    };

    addVoteToAnswerSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    response = await supertest(app).post('/answer/downvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);
  });

  it('should return bad request error if the request had id missing', async () => {
    const mockReqBody = {
      uid: user1.uid,
    };

    const response = await supertest(app).post(`/answer/upvoteAnswer`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/answer/upvoteAnswer`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /downvoteAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should downvote a answer successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      uid: user1.uid,
    };

    const mockResponse = {
      msg: 'Answer downvoted successfully',
      downVotes: [user1.uid],
      upVotes: [],
    };

    addVoteToAnswerSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/answer/downvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should cancel the downvote successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      uid: user1.uid,
    };

    const mockSecondResponse = {
      msg: 'Downvote cancelled successfully',
      downVotes: [],
      upVotes: [],
    };

    await supertest(app).post('/answer/downvoteAnswer').send(mockReqBody);

    addVoteToAnswerSpy.mockResolvedValueOnce(mockSecondResponse);

    const response = await supertest(app).post('/answer/downvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSecondResponse);
  });

  it('should handle downvote and then upvote by the same user', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      uid: user1.uid,
    };

    // First downvote the answer
    let mockResponse: MockResponse = {
      msg: 'Answer downvoted successfully',
      downVotes: [user1.uid],
      upVotes: [],
    };

    addVoteToAnswerSpy.mockResolvedValueOnce(mockResponse);

    let response = await supertest(app).post('/answer/downvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);

    // Then upvote the answer
    mockResponse = {
      msg: 'Answer upvoted successfully',
      downVotes: [],
      upVotes: [user1.uid],
    };

    addVoteToAnswerSpy.mockResolvedValueOnce(mockResponse);

    response = await supertest(app).post('/answer/upvoteAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request had id missing', async () => {
    const mockReqBody = {
      uid: user1.uid,
    };

    const response = await supertest(app).post(`/answer/downvoteAnswer`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/answer/downvoteAnswer`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});
