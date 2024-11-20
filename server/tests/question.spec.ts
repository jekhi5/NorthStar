import supertest from 'supertest';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { PostNotification, Question, User } from '../types';

const addVoteToQuestionSpy = jest.spyOn(util, 'addVoteToQuestion');
const getQuestionsByAskedByUserIdSpy = jest.spyOn(util, 'getQuestionsByAskedByUserId');
const getQuestionsByAnsweredByUserIdSpy = jest.spyOn(util, 'getQuestionsByAnsweredByUserId');
const processTagsSpy = jest.spyOn(util, 'processTags');
const saveQuestionSpy = jest.spyOn(util, 'saveQuestion');
const populateDocumentSpy = jest.spyOn(util, 'populateDocument');
const postNotificationsSpy = jest.spyOn(util, 'postNotifications');

interface MockResponse {
  msg: string;
  upVotes: string[];
  downVotes: string[];
}

const user1: User = {
  _id: new ObjectId(),
  uid: 'ab53191e810c19729de860ea',
  username: 'User1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user2: User = {
  uid: 'ab531234510c19729de860ea',
  username: 'User2',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user3: User = {
  uid: 'ab53191e810caaa29de860ea',
  username: 'User3',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user4: User = {
  uid: 'ab45891e810c19729de860ea',
  username: 'User4',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const tag1 = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
  subscribers: [user1, user3],
};
const tag2 = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
  description: 'tag2 description',
  subscribers: [user2],
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

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ansBy: user2,
  ansDateTime: '2024-06-10',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans3 = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'Answer 3 Text',
  ansBy: user3,
  ansDateTime: '2024-06-11',
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans4 = {
  _id: '65e9b58910afe6e94fc6e6dg',
  text: 'Answer 4 Text',
  ansBy: user4,
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
    askedBy: user1,
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    askedBy: user2,
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: '34e9b58910afe6e94fc6e99f',
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    askedBy: user3,
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
];

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
      uid: user3.uid,
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
      `/question/getQuestionById/${mockReqParams.qid}?uid=${mockReqQuery.uid}`,
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
      uid: user2.uid,
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
      `/question/getQuestionById/${mockReqParams.qid}?uid=${mockReqQuery.uid}`,
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
      uid: user2.uid,
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?uid=${mockReqQuery.uid}`,
    );

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return bad request error if the username is not provided', async () => {
    // Mock request parameters
    const mockReqParams = {
      id: '65e9b5a995b6c7045a30d823',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.id}`);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user requesting question.');
  });

  it('should return database error if the question id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };
    const mockReqQuery = {
      uid: user2.uid,
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?uid=${mockReqQuery.uid}`,
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
      uid: user4.uid,
    };

    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce({ error: 'Error when fetching and updating a question' });

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionById/${mockReqParams.qid}?uid=${mockReqQuery.uid}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('GET /getQuestionsByAskedByUserId', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return an array of questions when the user id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqQuery = {
      userId: user1._id,
    };

    const mockPopulatedQuestions = MOCK_QUESTIONS.map(q =>
      q.askedBy._id === mockReqQuery.userId
        ? {
            ...q,
            _id: new ObjectId(q._id),
            tags: [],
            answers: [],
            askDateTime: q.askDateTime,
          }
        : null,
    ).filter(q => q !== null);

    // Provide mock question data
    getQuestionsByAskedByUserIdSpy.mockResolvedValueOnce(mockPopulatedQuestions);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAskedByUserId?userId=${mockReqQuery.userId}`,
    );

    const expectedResponse = mockPopulatedQuestions.map(q => ({
      ...q,
      _id: q._id.toString(),
      askedBy: { ...q.askedBy, _id: q.askedBy._id?.toString() },
      askDateTime: q.askDateTime.toISOString(),
    }));

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return an empty array if the user has not asked any questions', async () => {
    // Mock request parameters
    const mockReqQuery = {
      userId: user4._id,
    };

    // Provide mock question data
    getQuestionsByAskedByUserIdSpy.mockResolvedValueOnce([]);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAskedByUserId?userId=${mockReqQuery.userId}`,
    );

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return bad request error if id is missing', async () => {
    // Making the request
    const response = await supertest(app).get(`/question/getQuestionsByAskedByUserId?userId=${''}`);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid id.');
  });

  it('should return bad request error if an error occurs when fetching the questions', async () => {
    // Mock request parameters
    const mockReqQuery = {
      userId: user1._id,
    };

    // Provide mock question data
    getQuestionsByAskedByUserIdSpy.mockResolvedValueOnce(null as unknown as Question[]);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAskedByUserId?userId=${mockReqQuery.userId}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('GET /getQuestionsByAnsweredByUserId', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return an array of questions when the user id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqQuery = {
      userId: user1._id,
    };

    const mockPopulatedQuestions = MOCK_QUESTIONS.map(q =>
      q.answers.some(a => a.ansBy._id === mockReqQuery.userId)
        ? {
            ...q,
            _id: new ObjectId(q._id),
            tags: [],
            answers: [],
            askDateTime: q.askDateTime,
          }
        : null,
    ).filter(q => q !== null);

    // Provide mock question data
    getQuestionsByAnsweredByUserIdSpy.mockResolvedValueOnce(mockPopulatedQuestions);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAnsweredByUserId?userId=${mockReqQuery.userId}`,
    );

    const expectedResponse = mockPopulatedQuestions.map(q => ({
      ...q,
      _id: q._id.toString(),
      askedBy: { ...q.askedBy, _id: q.askedBy._id?.toString() },
      askDateTime: q.askDateTime.toISOString(),
    }));

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return an empty array if the user has not answered any questions', async () => {
    // Mock request parameters
    const mockReqQuery = {
      userId: user4._id,
    };

    // Provide mock question data
    getQuestionsByAnsweredByUserIdSpy.mockResolvedValueOnce([]);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAnsweredByUserId?userId=${mockReqQuery.userId}`,
    );

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return bad request error if id is missing', async () => {
    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAnsweredByUserId?userId=${''}`,
    );

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user id.');
  });

  it('should return bad request error if an error occurs when fetching the questions', async () => {
    // Mock request parameters
    const mockReqQuery = {
      userId: user1._id,
    };

    // Provide mock question data
    getQuestionsByAnsweredByUserIdSpy.mockResolvedValueOnce(null as unknown as Question[]);

    // Making the request
    const response = await supertest(app).get(
      `/question/getQuestionsByAnsweredByUserId?userId=${mockReqQuery.userId}`,
    );

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('POST /addQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a question successfully', async () => {
    const mockReqBody: Question = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    const mockResponse = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [
        {
          ...tag1,
          _id: tag1._id?.toString(),
          subscribers: [
            { ...user1, _id: user1._id?.toString() },
            { ...user3, _id: user3._id?.toString() },
          ],
        },
        {
          ...tag2,
          _id: tag2._id?.toString(),
          subscribers: [{ ...user2, _id: user2._id?.toString() }],
        },
      ],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03').toISOString(),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    const mockNotification: PostNotification = {
      _id: new ObjectId(),
      title: 'Mock Notification',
      text: 'Mock Notification Text',
      notificationType: 'questionPostedWithTag',
      postId: mockReqBody._id ?? new ObjectId(),
      fromUser: user4,
    };

    processTagsSpy.mockResolvedValueOnce([tag1, tag2]);
    saveQuestionSpy.mockResolvedValueOnce(mockReqBody);
    populateDocumentSpy.mockResolvedValueOnce(mockReqBody);
    postNotificationsSpy.mockResolvedValueOnce(mockNotification);

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/question/addQuestion');

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request body is missing title', async () => {
    const mockReqBody = {
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request body is missing text', async () => {
    const mockReqBody = {
      title: 'Question 4 Title',
      tags: [tag1, tag2],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request body is missing tags', async () => {
    const mockReqBody = {
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request body is missing askedBy', async () => {
    const mockReqBody = {
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      askDateTime: new Date('2024-06-03'),
    };

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request body is missing askDateTime', async () => {
    const mockReqBody = {
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      askedBy: user4,
    };

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if an error occurs when processing tags', async () => {
    const mockReqBody: Question = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    processTagsSpy.mockRejectedValueOnce(new Error('Error when processing tags'));

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when saving the question', async () => {
    const mockReqBody: Question = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    processTagsSpy.mockResolvedValueOnce([tag1, tag2]);
    saveQuestionSpy.mockResolvedValueOnce({ error: 'Error when saving the question' });

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when populating the document', async () => {
    const mockReqBody: Question = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    processTagsSpy.mockResolvedValueOnce([tag1, tag2]);
    saveQuestionSpy.mockResolvedValueOnce(mockReqBody);
    populateDocumentSpy.mockResolvedValueOnce({ error: 'Error when populating the document' });

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should post question successfully even if an error occurs when posting notifications', async () => {
    const mockReqBody: Question = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    const mockResponse = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc').toString(),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [
        {
          ...tag1,
          _id: tag1._id?.toString(),
          subscribers: [
            { ...user1, _id: user1._id?.toString() },
            { ...user3, _id: user3._id?.toString() },
          ],
        },
        {
          ...tag2,
          _id: tag2._id?.toString(),
          subscribers: [{ ...user2, _id: user2._id?.toString() }],
        },
      ],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03').toISOString(),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    processTagsSpy.mockResolvedValueOnce([tag1, tag2]);
    saveQuestionSpy.mockResolvedValueOnce(mockReqBody);
    populateDocumentSpy.mockResolvedValueOnce(mockReqBody);
    postNotificationsSpy.mockRejectedValueOnce(new Error('Could not find answer that was posted'));

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return 500 error if the processed tags are empty', async () => {
    const mockReqBody: Question = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      title: 'Question 4 Title',
      text: 'Question 4 Text',
      tags: [tag1, tag2],
      answers: [],
      askedBy: user4,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      subscribers: [],
    };

    processTagsSpy.mockResolvedValueOnce([]);

    const response = await supertest(app).post('/question/addQuestion').send(mockReqBody);

    expect(response.status).toBe(500);
  });
});

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
      uid: user1.uid,
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      upVotes: [user1.uid],
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
      uid: user2.uid,
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
      uid: user3.uid,
    };

    // First upvote the question
    let mockResponseWithBothVotes: MockResponse = {
      msg: 'Question upvoted successfully',
      upVotes: [user3.uid],
      downVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    let response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);

    // Now downvote the question
    mockResponseWithBothVotes = {
      msg: 'Question downvoted successfully',
      downVotes: [user3.uid],
      upVotes: [],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

    response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseWithBothVotes);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      uid: user4.uid,
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      id: '65e9b5a995b6c7045a30d823',
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
      uid: user2.uid,
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      downVotes: [user2.uid],
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
      uid: user4.uid,
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
      uid: user2.uid,
    };

    // First downvote the question
    let mockResponse: MockResponse = {
      msg: 'Question downvoted successfully',
      downVotes: [user2.uid],
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
      upVotes: [user2.uid],
    };

    addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      uid: user1.uid,
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
