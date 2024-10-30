import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Question } from '../types';

const addVoteToQuestionSpy = jest.spyOn(util, 'addVoteToQuestion');

interface MockResponse {
  msg: string;
  upVotes: string[];
  downVotes: string[];
}

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1',
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2',
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ansBy: 'answer1_user',
  ansDateTime: '2024-06-09',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ansBy: 'answer2_user',
  ansDateTime: '2024-06-10',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans3 = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'Answer 3 Text',
  ansBy: 'answer3_user',
  ansDateTime: '2024-06-11',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans4 = {
  _id: '65e9b58910afe6e94fc6e6dg',
  text: 'Answer 4 Text',
  ansBy: 'answer4_user',
  ansDateTime: '2024-06-14',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const MOCK_QUESTIONS = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    askedBy: 'question2_user',
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: '34e9b58910afe6e94fc6e99f',
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    askedBy: 'question3_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

describe('POST /upvoteQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should upvote a question successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      upVotes: ['new-user'],
      downVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should cancel the upvote successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      username: 'some-user',
    };

    const mockSecondResponse = {
      msg: 'Upvote cancelled successfully',
      upVotes: [],
      downVotes: [],
    };

    await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    addVoteToQuestionSpy.mockResolvedValueOnce(mockSecondResponse);

    const response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSecondResponse);
  });

  it('should handle upvote and then downvote by the same user', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    // First upvote the question
    let mockResponseWithBothVotes: MockResponse = {
      msg: 'Question upvoted successfully',
      upVotes: ['new-user'],
      downVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    let response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);

    // Now downvote the question
    mockResponseWithBothVotes = {
      msg: 'Question downvoted successfully',
      downVotes: ['new-user'],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      username: 'some-user',
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /downvoteQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should downvote a question successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      downVotes: ['new-user'],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should cancel the downvote successfully', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      username: 'some-user',
    };

    const mockSecondResponse = {
      msg: 'Downvote cancelled successfully',
      downVotes: [],
      upVotes: [],
    };

    await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    addVoteToQuestionSpy.mockResolvedValueOnce(mockSecondResponse);

    const response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSecondResponse);
  });

  it('should handle downvote and then upvote by the same user', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    // First downvote the question
    let mockResponse: MockResponse = {
      msg: 'Question downvoted successfully',
      downVotes: ['new-user'],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    let response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);

    // Then upvote the question
    mockResponse = {
      msg: 'Question upvoted successfully',
      downVotes: [],
      upVotes: ['new-user'],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      username: 'some-user',
    };

    const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('GET /getQuestionById/:qid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a question object in the response when the question id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question3_user',
    };

    const findq = MOCK_QUESTIONS.filter(q => q._id.toString() === mockReqParams.qid)[0];

    const mockPopulatedQuestion = {
      ...findq,
      _id: new mongoose.Types.ObjectId(findq._id),
      views: ['question1_user', 'question2_user', 'question3_user'],
      tags: [],
      answers: [],
      askDateTime: findq.askDateTime,
    };

    // Provide mock question data
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce(mockPopulatedQuestion as Question);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    const expectedResponse = {
      ...mockPopulatedQuestion,
      _id: mockPopulatedQuestion._id.toString(),
      askDateTime: mockPopulatedQuestion.askDateTime.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should not return a question object with a duplicated user in the views if the user is viewing the same question again', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    const findq = MOCK_QUESTIONS.filter(q => q._id.toString() === mockReqParams.qid)[0];

    const mockPopulatedQuestion = {
      ...findq,
      _id: new mongoose.Types.ObjectId(findq._id),
      tags: [],
      answers: [],
      askDateTime: findq.askDateTime,
    };

    // Provide mock question data
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce(mockPopulatedQuestion as Question);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    const expectedResponse = {
      ...mockPopulatedQuestion,
      _id: mockPopulatedQuestion._id.toString(),
      askDateTime: mockPopulatedQuestion.askDateTime.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the question id is not in the correct format', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: 'invalid id',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return bad request error if the username is not provided', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid username requesting question.');
  });

  it('should return database error if the question id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when fetching and updating the question', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      username: 'question2_user',
    };

    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce({ error: 'Error when fetching and updating a question' });

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });
});
