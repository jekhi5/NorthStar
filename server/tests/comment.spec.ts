import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Question } from '../types';

const saveCommentSpy = jest.spyOn(util, 'saveComment');
const addCommentSpy = jest.spyOn(util, 'addComment');
const popDocSpy = jest.spyOn(util, 'populateDocument');

describe('POST /addComment', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new comment to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
    ***REMOVED***

    saveCommentSpy.mockResolvedValueOnce(mockComment);

    addCommentSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [mockComment._id],
    } as Question);

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [mockComment],
    });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validCid.toString(),
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: mockComment.commentDateTime.toISOString(),
      upVotes: [],
      downVotes: [],
    });
  });

  it('should add a new comment to the answer', async () => {
    const validAid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validAid.toString(),
      type: 'answer',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
    ***REMOVED***

    saveCommentSpy.mockResolvedValueOnce(mockComment);

    addCommentSpy.mockResolvedValueOnce({
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
      comments: [mockComment._id],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
      comments: [mockComment],
    });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validCid.toString(),
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: mockComment.commentDateTime.toISOString(),
      upVotes: [],
      downVotes: [],
    });
  });

  it('should return bad request error if id property missing', async () => {
    const mockReqBody = {
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if type property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      comment: {
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if type property is not `question` or `answer` ', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'invalidType',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if comment text property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if text property of comment is empty', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      comment: {
        text: '',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid comment body');
  });

  it('should return bad request error if commentBy property missing', async () => {
    const mockReqBody = {
      id: 'dummyQuestionId',
      type: 'question',
      com: {
        text: 'This is a test comment',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if commentDateTime property missing', async () => {
    const mockReqBody = {
      id: 'dummyQuestionId',
      type: 'answer',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/comment/addComment');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if qid is not a valid ObjectId', async () => {
    const mockReqBody = {
      id: 'invalidObjectId',
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return database error in response if saveComment method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    saveCommentSpy.mockResolvedValueOnce({ error: 'Error when saving a comment' });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding comment: Error when saving a comment');
  });

  it('should return database error in response if `addComment` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
    ***REMOVED***

    saveCommentSpy.mockResolvedValueOnce(mockComment);
    addCommentSpy.mockResolvedValueOnce({
      error: 'Error when adding comment',
    });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding comment: Error when adding comment');
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    ***REMOVED***

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
      upVotes: [],
      downVotes: [],
    ***REMOVED***

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [mockComment._id],
    ***REMOVED***

    saveCommentSpy.mockResolvedValueOnce(mockComment);
    addCommentSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding comment: Error when populating document');
  });
});
