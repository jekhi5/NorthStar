import { ObjectId } from 'mongodb';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  addVoteToAnswer,
  addVoteToComment,
  saveUser,
  updateUserReputation,
  populateDocument,
  getQuestionsByAnsweredByUserId,
  getQuestionsByAskedByUserId,
  savePostNotification,
  postNotifications,
  updateNotificationReadStatus,
  editUser,
  getMessages,
  saveMessage,
  updateMessage,
  deleteMessage,
  toggleSubscribe,
} from '../models/application';
import { Answer, Question, Tag, Comment, User, PostNotification, Message } from '../types';
import { T1_DESC, T2_DESC, T3_DESC } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import CommentModel from '../models/comments';
import UserModel from '../models/user';
import TagModel from '../models/tags';
import * as util from '../models/application';
import PostNotificationModel from '../models/postNotifications';
import MessageModel from '../models/messages';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const user1: User = {
  _id: new ObjectId('ab53191e810c19729de860ea'),
  uid: 'ab53191e810c19729de860ea',
  username: 'User1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user2: User = {
  _id: new ObjectId('ab531234510c19729de860ea'),
  uid: 'ab531234510c19729de860ea',
  username: 'User2',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user3: User = {
  _id: new ObjectId('ab53191e810caaa29de860ea'),
  uid: 'ab53191e810caaa29de860ea',
  username: 'User3',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user4: User = {
  _id: new ObjectId('ab45891e810c19729de860ea'),
  uid: 'ab45891e810c19729de860ea',
  username: 'User4',
  email: 'user4@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
  subscribers: [],
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
  subscribers: [],
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
  subscribers: [],
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: user1,
  commentDateTime: new Date('2023-11-18T09:25:00'),
  upVotes: [],
  downVotes: [],
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: user1,
  ansDateTime: new Date('2023-11-18T09:24:00'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: user2,
  ansDateTime: new Date('2023-11-20T09:24:00'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: user3,
  ansDateTime: new Date('2023-11-19T09:24:00'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: user4,
  ansDateTime: new Date('2023-11-19T09:24:00'),
  upVotes: [],
  downVotes: [],
  comments: [],
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: user1,
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: user2,
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: user3,
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: user4,
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
];

const postNotification1: PostNotification = {
  _id: new ObjectId('65e9b716ff0e892116b2de09'),
  title: 'Post Notification 1',
  text: 'This is a test post notification',
  notificationType: 'questionAnswered',
  postId: QUESTIONS[0]._id as ObjectId,
  fromUser: user1,
};

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, user4.uid);

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, user2.uid);

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('get questions sorted by most votes', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            upVotes: ['user1', 'user2', 'user3'],
            downVotes: ['user4'],
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            upVotes: ['user1', 'user2'],
            downVotes: [],
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            upVotes: ['user1'],
            downVotes: ['user2', 'user3'],
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            upVotes: [],
            downVotes: [],
          },
        ];

        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('upVotes', Object);
        QuestionModel.schema.path('downVotes', Object);

        const result = await getQuestionsByOrder('mostVotes');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
      });

      test('get questions sorted by most votes with equal vote counts', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            upVotes: ['user1', 'user2'],
            downVotes: [],
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            upVotes: ['user1', 'user2'],
            downVotes: [],
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            upVotes: ['user1'],
            downVotes: ['user2'],
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            upVotes: ['user1'],
            downVotes: [],
          },
        ];

        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('upVotes', Object);
        QuestionModel.schema.path('downVotes', Object);

        const result = await getQuestionsByOrder('mostVotes');

        expect(result.length).toEqual(4);
        // The first two questions have equal votes, so their order might be arbitrary
        expect(result[0]._id?.toString()).toMatch(/65e9b716ff0e892116b2de0[12]/);
        expect(result[1]._id?.toString()).toMatch(/65e9b716ff0e892116b2de0[12]/);
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
      });

      test('get questions sorted by most votes with empty list', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');

        const result = await getQuestionsByOrder('mostVotes');

        expect(result.length).toEqual(0);
      });

      test('get questions sorted by most votes with error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'find');

        const result = await getQuestionsByOrder('mostVotes');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: user3,
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [],
        };

        const result = (await saveQuestion(mockQn)) as Question;
        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy._id).toEqual(mockQn.askedBy._id);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });

      test('saveQuestion should return an object with error if create throws an error', async () => {
        jest.spyOn(QuestionModel, 'create').mockImplementationOnce(() => {
          throw new Error('error');
        });

        const result = await saveQuestion({
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: user3,
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [],
        });

        expect(result).toEqual({ error: 'Error when saving a question' });
      });
    });

    describe('addVoteToQuestion', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          title: 'Some question',
          upVotes: [],
          downVotes: [],
          askedBy: user1,
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser1'], downVotes: [] },
          'findOneAndUpdate',
        );

        // The user has already received the upvote notification for reaching 1 upvote
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user1);

        const result = await addVoteToQuestion('someQuestionId', 'testUser1', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser1'],
          downVotes: [],
          upvoteNotification: null,
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser1'],
          askedBy: user1,
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser1'], downVotes: [] },
          'findOneAndUpdate',
        );

        // The user has already received the upvote notification for reaching 1 upvote
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user1);

        const result = await addVoteToQuestion('someQuestionId', 'testUser1', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser1'],
          downVotes: [],
          upvoteNotification: null,
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
          upvoteNotification: null,
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
          upvoteNotification: null,
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
          upvoteNotification: null,
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
          upvoteNotification: null,
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
          upvoteNotification: null,
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });

    describe('getQuestionsByAnsweredByUserId', () => {
      test('getQuestionsByAnsweredByUserId should return questions answered by the given user', async () => {
        const questions = QUESTIONS.filter(q =>
          q.answers.some(a => (a as Answer).ansBy._id === user1._id),
        );
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByAnsweredByUserId(user1._id?.toString() as string);

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('getQuestionsByAnsweredByUserId should return an empty list if no questions are answered by the given user', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByAnsweredByUserId('nonExistentUserId');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByAnsweredByUserId should return an empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByAnsweredByUserId(user1._id?.toString() as string);

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByAnsweredByUserId should return an empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByAnsweredByUserId(user1._id?.toString() as string);

        expect(result.length).toEqual(0);
      });
    });

    describe('getQuestionsByAskedByUserId', () => {
      test('getQuestionsByAskedByUserId should return questions asked by the given user', async () => {
        const questions = QUESTIONS.filter(q => q.askedBy._id === user1._id);
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByAskedByUserId(user1._id?.toString() as string);

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('getQuestionsByAskedByUserId should return an empty list if no questions are asked by the given user', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByAskedByUserId('nonExistentUserId');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByAskedByUserId should return an empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByAskedByUserId(user1._id?.toString() as string);

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByAskedByUserId should return an empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByAskedByUserId(user1._id?.toString() as string);

        expect(result.length).toEqual(0);
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: user1,
          ansDateTime: new Date('2024-06-06'),
          upVotes: [],
          downVotes: [],
          comments: [],
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy._id).toEqual(mockAnswer.ansBy._id);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });

      test('saveAnswer should return an object with error if create throws an error', async () => {
        jest.spyOn(AnswerModel, 'create').mockImplementationOnce(() => {
          throw new Error('error');
        });

        const result = await saveAnswer({
          text: 'This is a test answer',
          ansBy: user1,
          ansDateTime: new Date('2024-06-06'),
          upVotes: [],
          downVotes: [],
          comments: [],
        });

        expect(result).toEqual({ error: 'Error when saving an answer' });
      });

      test('saveAnswer should return the saved answer even if updating reputation fails', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: user1,
          ansDateTime: new Date('2024-06-06'),
          upVotes: [],
          downVotes: [],
          comments: [],
        };

        jest.spyOn(util, 'updateUserReputation').mockRejectedValueOnce(new Error('error'));

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy._id).toEqual(mockAnswer.ansBy._id);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);

        const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

        expect(result.answers.length).toEqual(4);
        expect(result.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: user3, // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });

    describe('addVoteToAnswer', () => {
      test('addVoteToAnswer should upvote an answer', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(AnswerModel).toReturn(
          { ...mockAnswer, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Answer upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(AnswerModel).toReturn(
          { ...mockAnswer, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Answer upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(AnswerModel).toReturn(
          { ...mockAnswer, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToAnswer should return an error if the answer is not found', async () => {
        mockingoose(AnswerModel).toReturn(null, 'findById');

        const result = await addVoteToAnswer('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Answer not found!' });
      });

      test('addVoteToAnswer should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(AnswerModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to answer' });
      });

      test('addVoteToAnswer should downvote an answer', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(AnswerModel).toReturn(
          { ...mockAnswer, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Answer downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(AnswerModel).toReturn(
          { ...mockAnswer, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Answer downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockAnswer = {
          _id: 'someAnswerId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(AnswerModel).toReturn(
          { ...mockAnswer, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToAnswer should return an error if the answer is not found', async () => {
        mockingoose(AnswerModel).toReturn(null, 'findById');

        const result = await addVoteToAnswer('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Answer not found!' });
      });

      test('addVoteToAnswer should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(AnswerModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToAnswer('someAnswerId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to answer' });
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(TagModel).toReturn(tag1, 'findOne');

        const result = await addTag({
          name: tag1.name,
          description: tag1.description,
          subscribers: [],
        });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(TagModel).toReturn(null, 'findOne');

        const result = await addTag({
          name: tag2.name,
          description: tag2.description,
          subscribers: [],
        });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(TagModel).toReturn(new Error('error'), 'findOne');

        const result = await addTag({
          name: tag1.name,
          description: tag1.description,
          subscribers: [],
        });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(TagModel).toReturn(null, 'findOne');
        mockingoose(TagModel).toReturn(new Error('error'), 'save');

        const result = await addTag({
          name: tag2.name,
          description: tag2.description,
          subscribers: [],
        });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(TagModel).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(TagModel).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(TagModel).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(TagModel).toReturn(null, 'findOne');
        mockingoose(TagModel).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(TagModel).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(TagModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(TagModel).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should return default map if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(TagModel).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBe(0);
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(TagModel).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy._id).toEqual(com1.commentBy._id);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });

      test('saveComment should return an object with error if create throws an error', async () => {
        jest.spyOn(CommentModel, 'create').mockImplementationOnce(() => {
          throw new Error('error');
        });

        const result = await saveComment(com1);

        expect(result).toEqual({ error: 'Error when saving a comment' });
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: user4, // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });

    describe('addVoteToComment', () => {
      test('addVoteToComment should upvote an comment', async () => {
        const mockComment = {
          _id: 'someCommentId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(CommentModel).toReturn(
          { ...mockComment, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToComment('someCommentId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Comment upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockComment = {
          _id: 'someCommentId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(CommentModel).toReturn(
          { ...mockComment, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToComment('someCommentId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Comment upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockComment = {
          _id: 'someCommentId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(CommentModel).toReturn(
          { ...mockComment, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToComment('someCommentId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToComment should return an error if the comment is not found', async () => {
        mockingoose(CommentModel).toReturn(null, 'findById');

        const result = await addVoteToComment('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Comment not found!' });
      });

      test('addVoteToComment should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(CommentModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToComment('someCommentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to comment' });
      });

      test('addVoteToComment should downvote a comment', async () => {
        const mockComment = {
          _id: 'someCommentId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(CommentModel).toReturn(
          { ...mockComment, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToComment('someCommentId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Comment downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockComment = {
          _id: 'someCommentId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(CommentModel).toReturn(
          { ...mockComment, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToComment('someCommentId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Comment downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockComment = {
          _id: 'someCommentId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(CommentModel).toReturn(
          { ...mockComment, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToComment('someCommentId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToComment should return an error if the comment is not found', async () => {
        mockingoose(CommentModel).toReturn(null, 'findById');

        const result = await addVoteToComment('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Comment not found!' });
      });

      test('addVoteToComment should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(CommentModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToComment('someCommentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to comment' });
      });
    });
  });

  describe('User Model', () => {
    describe('saveUser', () => {
      test('saveUser should return the saved user', async () => {
        const mockUser: User = {
          uid: '1',
          email: 'test@gmail.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          status: 'Not endorsed',
          postNotifications: [],
          reputation: 0,
        };

        const result = (await saveUser(mockUser)) as User;
        expect(result._id).toBeDefined();
        expect(result.uid).toEqual(mockUser.uid);
        expect(result.email).toEqual(mockUser.email);
        expect(result.firstName).toEqual(mockUser.firstName);
        expect(result.lastName).toEqual(mockUser.lastName);
        expect(result.status).toEqual('Not endorsed');
        expect(result.reputation).toEqual(0);
      });

      test('saveUser should return an object with error if create throws an error', async () => {
        jest.spyOn(UserModel, 'create').mockImplementationOnce(() => {
          throw new Error('error');
        });

        const result = await saveUser({
          uid: '1',
          email: 'test@email.com',
          username: 'test',
          status: 'Not endorsed',
          postNotifications: [],
          reputation: 0,
        });

        expect(result).toEqual({ error: 'Error when saving a User' });
      });
    });

    describe('updateUserReputation', () => {
      test('updateUserReputation should return the given user with updated reputation', async () => {
        const user: User = {
          uid: '1',
          email: 'user@gmail.com',
          username: 'user123',
          status: 'Not endorsed',
          postNotifications: [],
          reputation: 0,
        };

        const updatedUser: User = {
          uid: '1',
          email: 'user@gmail.com',
          username: 'user123',
          status: 'Not endorsed',
          postNotifications: [],
          reputation: 10,
        };

        mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');

        const result = (await updateUserReputation(user.uid, 10)) as User;
        expect(result.reputation).toEqual(10);
      });

      test('updateUserReputation should decrease user reputation, when given a negative value', async () => {
        const mockUser = {
          uid: '1',
          email: 'user@gmail.com',
          username: 'user123',
          status: 'Not endorsed',
          reputation: 10,
        };

        mockingoose(UserModel).toReturn({ ...mockUser, reputation: 5 }, 'findOneAndUpdate');

        const result = await updateUserReputation('1', -5);

        expect(result).toHaveProperty('reputation', 5);
        expect(result).toHaveProperty('uid', '1');
      });

      test('updateUserReputation should throw error if user uid not found', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');
        const result = await updateUserReputation('nonExistentUid', 5);

        expect(result).toEqual({ error: 'Error updating user reputation' });
      });

      test('should return error when database operation fails', async () => {
        mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await updateUserReputation('testUid', 5);

        expect(result).toEqual({ error: 'Error updating user reputation' });
      });
    });

    describe('editUser', () => {
      test('editUser should return the updated user', async () => {
        const updatedUser: User = {
          ...user1,
          username: 'UpdatedUser1',
          email: 'updateduser1@email.com',
        };

        mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');

        const result = (await editUser(updatedUser)) as User;

        expect(result._id?.toString()).toEqual(updatedUser._id?.toString());
        expect(result.username).toEqual(updatedUser.username);
        expect(result.email).toEqual(updatedUser.email);
      });

      test('editUser should return an error if user uid is not provided', async () => {
        const invalidUser: Partial<User> = {
          username: 'InvalidUser',
          email: 'invaliduser@email.com',
        };

        const result = await editUser(invalidUser as User);

        expect(result).toEqual({ error: 'Error when updating user.' });
      });

      test('editUser should return an error if user username is not provided', async () => {
        const invalidUser: Partial<User> = {
          uid: 'someUid',
          email: 'invaliduser@email.com',
        };

        const result = await editUser(invalidUser as User);

        expect(result).toEqual({ error: 'Error when updating user.' });
      });

      test('editUser should return an error if user email is not provided', async () => {
        const invalidUser: Partial<User> = {
          uid: 'someUid',
          username: 'InvalidUser',
        };

        const result = await editUser(invalidUser as User);

        expect(result).toEqual({ error: 'Error when updating user.' });
      });

      test('editUser should return an error if findOneAndUpdate throws an error', async () => {
        const updatedUser: User = {
          ...user1,
          username: 'UpdatedUser1',
          email: 'updateduser1@email.com',
        };

        mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await editUser(updatedUser);

        expect(result).toEqual({ error: 'Error when updating user.' });
      });

      test('editUser should return an error if findOneAndUpdate returns null', async () => {
        const updatedUser: User = {
          ...user1,
          username: 'UpdatedUser1',
          email: 'updateduser1@email.com',
        };

        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await editUser(updatedUser);

        expect(result).toEqual({ error: 'Error when updating user.' });
      });
    });
  });

  describe('Notification model', () => {
    describe('savePostNotification', () => {
      test('savePostNotification should return the saved postNotification', async () => {
        const mockPostNotification: PostNotification = {
          title: 'New Post Notification',
          text: 'This is a new post notification',
          notificationType: 'questionAnswered',
          postId: new ObjectId(),
          fromUser: user1,
        };

        const result = (await savePostNotification(mockPostNotification)) as PostNotification;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockPostNotification.title);
        expect(result.text).toEqual(mockPostNotification.text);
        expect(result.notificationType).toEqual(mockPostNotification.notificationType);
        expect(result.postId?.toString()).toEqual(mockPostNotification.postId?.toString());
        expect(result.fromUser?._id?.toString()).toEqual(
          mockPostNotification.fromUser?._id?.toString(),
        );
      });

      test('savePostNotification should return an object with error if create throws an error', async () => {
        jest.spyOn(PostNotificationModel, 'create').mockImplementationOnce(() => {
          throw new Error('error');
        });

        const result = await savePostNotification({
          title: 'New Post Notification',
          text: 'This is a new post notification',
          notificationType: 'questionAnswered',
          postId: new ObjectId(),
          fromUser: user1,
        });

        expect(result).toEqual({ error: 'Error when saving a postNotification' });
      });
    });

    describe('postNotifications', () => {
      test('postNotifications should return the posted notification', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [{ ...ans1, ansBy: { ...user1, username: 'User1' } }, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [user2._id, user3._id],
        };

        const mockNotification: PostNotification = {
          _id: new ObjectId(),
          title: `Your question: "${mockQuestion.title}" has a new answer!`,
          text: `undefined said: "${ans1.text}"`,
          notificationType: 'questionAnswered',
          postId: mockQuestion._id,
          fromUser: user1,
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(AnswerModel).toReturn(
          { ...ans1, ansBy: { ...user1, username: 'User1' } },
          'findOne',
        );
        mockingoose(PostNotificationModel).toReturn(mockNotification, 'create');

        if (!mockNotification.postId) {
          expect(true).toBeFalsy();
          return;
        }

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'questionAnswered',
          user1,
          mockNotification.postId.toString(),
        )) as PostNotification;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockNotification.title);
        expect(result.text).toEqual(mockNotification.text);
        expect(result.notificationType).toEqual(mockNotification.notificationType);
        expect(result.postId?.toString()).toEqual(mockNotification.postId?.toString());
        expect(result.fromUser?._id?.toString()).toEqual(
          mockNotification.fromUser?._id?.toString(),
        );
      });

      test('postNotifications should return an error if question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        const result = (await postNotifications(
          'nonExistentQuestionId',
          'questionAnswered',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Could not find question that had action taken',
        );
      });

      test('postNotifications should return an error if savePostNotification throws an error', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [user2._id, user3._id],
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(AnswerModel).toReturn(ans1, 'findOne');
        jest
          .spyOn(util, 'savePostNotification')
          .mockResolvedValueOnce({ error: 'Error when saving a postNotification' });

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'questionAnswered',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Error when saving a postNotification',
        );
      });

      test('postNotifications should return an error if notification type is invalid', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [user2._id, user3._id],
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'invalidType' as 'questionAnswered',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual('Error when posting notification: Invalid notification type');
      });

      test('postNotifications should return an error if question cannot be found', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [],
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'questionAnswered',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Could not find answer that was posted',
        );
      });

      test('postNotifications should return the posted notification for commentAdded', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [com1],
          subscribers: [user2._id, user3._id],
        };

        const mockNotification: PostNotification = {
          _id: new ObjectId(),
          title: 'A Comment Was Added to a Post You Subscribe to!',
          text: `${user1.username} said: "${mockQuestion.comments[0].text}"`,
          notificationType: 'commentAdded',
          postId: mockQuestion.comments[0]._id as ObjectId,
          fromUser: user1,
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(CommentModel).toReturn(com1, 'findOne');
        mockingoose(PostNotificationModel).toReturn(mockNotification, 'create');

        if (!mockNotification.postId) {
          expect(true).toBeFalsy();
          return;
        }

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'commentAdded',
          user1,
          mockNotification.postId.toString(),
        )) as PostNotification;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockNotification.title);
        expect(result.text).toEqual(mockNotification.text);
        expect(result.notificationType).toEqual(mockNotification.notificationType);
        expect(result.postId?.toString()).toEqual(mockNotification.postId.toString());
        expect(result.fromUser?._id?.toString()).toEqual(
          mockNotification.fromUser?._id?.toString(),
        );
      });

      test('postNotifications should return an error if comment is not found for commentAdded', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [com1],
          subscribers: [user2._id, user3._id],
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(CommentModel).toReturn(null, 'findOne');

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'commentAdded',
          user1,
          'nonExistentCommentId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Could not find comment that was posted',
        );
      });

      test('postNotifications should return an error if savePostNotification throws an error for commentAdded', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [com1],
          subscribers: [user2._id, user3._id],
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(CommentModel).toReturn(com1, 'findOne');
        jest
          .spyOn(util, 'savePostNotification')
          .mockResolvedValueOnce({ error: 'Error when saving a postNotification' });

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'commentAdded',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Error when saving a postNotification',
        );
      });

      test('postNotifications should return the posted notification for questionPostedWithTag', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [user2._id, user3._id],
        };

        const mockNotification: PostNotification = {
          _id: new ObjectId(),
          title: 'A Question Was Posted With a Tag You Subscribe to!',
          text: `The question: "${mockQuestion.title}" was asked by ${user1.username}`,
          notificationType: 'questionPostedWithTag',
          postId: mockQuestion._id,
          fromUser: user1,
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(PostNotificationModel).toReturn(mockNotification, 'create');

        if (!mockNotification.postId) {
          expect(true).toBeTruthy();
          return;
        }

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'questionPostedWithTag',
          user1,
          mockNotification.postId.toString(),
        )) as PostNotification;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockNotification.title);
        expect(result.text).toEqual(mockNotification.text);
        expect(result.notificationType).toEqual(mockNotification.notificationType);
        expect(result.postId?.toString()).toEqual(mockNotification.postId?.toString());
        expect(result.fromUser?._id?.toString()).toEqual(
          mockNotification.fromUser?._id?.toString(),
        );
      });

      test('postNotifications should return an error if question is not found for questionPostedWithTag', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        const result = (await postNotifications(
          'nonExistentQuestionId',
          'questionPostedWithTag',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Could not find question that had action taken',
        );
      });

      test('postNotifications should return an error if savePostNotification throws an error for questionPostedWithTag', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          title: 'Quick question about storage on android',
          text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
          tags: [tag3, tag2],
          answers: [ans1, ans2],
          askedBy: user1,
          askDateTime: new Date('2023-11-16T09:24:00'),
          views: ['question1_user', 'question2_user'],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [user2._id, user3._id],
        };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        jest
          .spyOn(util, 'savePostNotification')
          .mockResolvedValueOnce({ error: 'Error when saving a postNotification' });

        const result = (await postNotifications(
          mockQuestion._id.toString(),
          'questionPostedWithTag',
          user1,
          'somePostId',
        )) as { error: string };

        expect(result.error).toEqual(
          'Error when posting notification: Error when saving a postNotification',
        );
      });
    });

    describe('updateNotificationReadStatus', () => {
      test('updateNotificationReadStatus should return the updated user with the notification marked as read', async () => {
        const updatedUser: User = {
          ...user1,
          postNotifications: [{ postNotification: postNotification1, read: true }],
        };

        mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');

        const result = (await updateNotificationReadStatus(
          user1.uid,
          postNotification1._id as ObjectId,
        )) as User;

        expect(result.postNotifications.length).toEqual(1);
        expect(result.postNotifications[0].read).toBe(true);
      });

      test('updateNotificationReadStatus should return an error if user is not found', async () => {
        const postNotificationId = new ObjectId('65e9b58910afe6e94fc6e6dc');

        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await updateNotificationReadStatus(user1.uid, postNotificationId);

        expect(result).toEqual({ error: 'Error updating notification read status' });
      });

      test('updateNotificationReadStatus should return an error if findOneAndUpdate throws an error', async () => {
        const postNotificationId = new ObjectId('65e9b58910afe6e94fc6e6dc');

        mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await updateNotificationReadStatus(user1.uid, postNotificationId);

        expect(result).toEqual({ error: 'Error updating notification read status' });
      });
    });

    describe('toggleSubscribe', () => {
      test('toggleSubscribe should add a user to the subscribers list if not already subscribed', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          subscribers: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, subscribers: [user1._id] },
          'findOneAndUpdate',
        );

        const result = (await toggleSubscribe(
          mockQuestion._id.toString(),
          'question',
          user1,
        )) as Question;

        expect(result.subscribers.length).toEqual(1);
        expect(result.subscribers[0].toString()).toEqual(user1._id?.toString());
      });

      test('toggleSubscribe should remove a user from the subscribers list if already subscribed', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          subscribers: [user1._id],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, subscribers: [] },
          'findOneAndUpdate',
        );

        const result = (await toggleSubscribe(
          mockQuestion._id.toString(),
          'question',
          user1,
        )) as Question;

        expect(result.subscribers.length).toEqual(0);
      });

      test('toggleSubscribe should return an error if user is invalid', async () => {
        const invalidUser: Partial<User> = {};

        try {
          await toggleSubscribe('someQuestionId', 'question', invalidUser as User);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid user');
        }
      });

      test('toggleSubscribe should return an error if question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await toggleSubscribe('nonExistentQuestionId', 'question', user1);

        expect(result).toEqual({
          error: 'Error when toggling subscriber: Failed to toggle subscriber',
        });
      });

      test('toggleSubscribe should return an error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await toggleSubscribe('someQuestionId', 'question', user1);

        expect(result).toEqual({ error: 'Error when toggling subscriber: Database error' });
      });

      test('toggleSubscribe should add a user to the tag subscribers list if not already subscribed', async () => {
        const mockTag = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          subscribers: [],
        };

        mockingoose(TagModel).toReturn(
          { ...mockTag, subscribers: [user1._id] },
          'findOneAndUpdate',
        );

        const result = (await toggleSubscribe(mockTag._id.toString(), 'tag', user1)) as Tag;

        expect(result.subscribers.length).toEqual(1);
        expect(result.subscribers[0].toString()).toEqual(user1._id?.toString());
      });

      test('toggleSubscribe should remove a user from the tag subscribers list if already subscribed', async () => {
        const mockTag = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          subscribers: [user1._id],
        };

        mockingoose(TagModel).toReturn({ ...mockTag, subscribers: [] }, 'findOneAndUpdate');

        const result = (await toggleSubscribe(mockTag._id.toString(), 'tag', user1)) as Tag;

        expect(result.subscribers.length).toEqual(0);
      });

      test('toggleSubscribe should return an error if tag is not found', async () => {
        mockingoose(TagModel).toReturn(null, 'findOneAndUpdate');

        const result = await toggleSubscribe('nonExistentTagId', 'tag', user1);

        expect(result).toEqual({
          error: 'Error when toggling subscriber: Failed to toggle subscriber',
        });
      });

      test('toggleSubscribe should return an error if findOneAndUpdate throws an error for tag', async () => {
        mockingoose(TagModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await toggleSubscribe('someTagId', 'tag', user1);

        expect(result).toEqual({ error: 'Error when toggling subscriber: Database error' });
      });

      test('toggleSubscribe should error if type invalid', async () => {
        const mockQuestion = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          subscribers: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, subscribers: [user1._id] },
          'findOneAndUpdate',
        );

        const result = (await toggleSubscribe(
          mockQuestion._id.toString(),
          'invalidType' as 'question',
          user1,
        )) as Question;

        expect(result).toEqual({ error: 'Error when toggling subscriber: Invalid type' });
      });
    });
  });

  describe('populateDocument', () => {
    test('populateDocument should return a populated question', async () => {
      const question = QUESTIONS[0];
      mockingoose(QuestionModel).toReturn(question, 'findOne');
      QuestionModel.schema.path('tags', Object);
      QuestionModel.schema.path('answers', Object);

      const result = (await populateDocument(question._id?.toString(), 'question')) as Question;

      expect(result._id?.toString()).toEqual(question._id?.toString());
      expect(result.title).toEqual(question.title);
      expect(result.text).toEqual(question.text);
      expect(result.tags.length).toEqual(question.tags.length);
      expect(result.answers.length).toEqual(question.answers.length);
    });

    test('populateDocument should return a populated answer', async () => {
      const answer = ans1;
      mockingoose(AnswerModel).toReturn(answer, 'findOne');
      AnswerModel.schema.path('comments', Object);

      const result = (await populateDocument(answer._id?.toString(), 'answer')) as Answer;

      expect(result._id?.toString()).toEqual(answer._id?.toString());
      expect(result.text).toEqual(answer.text);
      expect(result.ansBy._id?.toString()).toEqual(answer.ansBy._id?.toString());
      expect(result.comments.length).toEqual(answer.comments.length);
    });

    test('populateDocument should return a populated tag', async () => {
      const tag = tag1;
      mockingoose(TagModel).toReturn(tag, 'findOne');

      const result = (await populateDocument(tag._id?.toString(), 'tag')) as Tag;

      expect(result._id?.toString()).toEqual(tag._id?.toString());
      expect(result.name).toEqual(tag.name);
      expect(result.description).toEqual(tag.description);
    });

    test('populateDocument should return a populated user', async () => {
      const user = user1;
      mockingoose(UserModel).toReturn(user, 'findOne');

      const result = (await populateDocument(user._id?.toString(), 'user')) as User;

      expect(result._id?.toString()).toEqual(user._id?.toString());
      expect(result.username).toEqual(user.username);
      expect(result.email).toEqual(user.email);
    });

    test('populateDocument should return an error if id is not provided', async () => {
      const result = (await populateDocument(undefined, 'question')) as { error: string };

      expect(result.error).toEqual(
        'Error when fetching and populating a document: Provided question ID is undefined.',
      );
    });

    test('populateDocument should return an error if document type is invalid', async () => {
      const result = (await populateDocument('someId', 'invalidType' as unknown as 'question')) as {
        error: string;
      };

      expect(result.error).toEqual(
        'Error when fetching and populating a document: Failed to fetch and populate a invalidType',
      );
    });

    test('populateDocument should return an error if document is not found', async () => {
      mockingoose(QuestionModel).toReturn(null, 'findOne');

      const result = (await populateDocument('nonExistentId', 'question')) as { error: string };

      expect(result.error).toEqual(
        'Error when fetching and populating a document: Failed to fetch and populate a question',
      );
    });

    test('populateDocument should return an error if findOne throws an error', async () => {
      mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOne');

      const result = (await populateDocument('someId', 'question')) as { error: string };

      expect(result.error).toEqual('Error when fetching and populating a document: Database error');
    });
  });

  describe('Message model', () => {
    describe('getMessages', () => {
      test('getMessages should return a list of messages sorted by sentDateTime in descending order', async () => {
        const messages = [
          {
            _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
            text: 'Message 1',
            sentBy: user1,
            sentDateTime: new Date('2023-11-18T09:24:00'),
          },
          {
            _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
            text: 'Message 2',
            sentBy: user2,
            sentDateTime: new Date('2023-11-19T09:24:00'),
          },
        ];

        mockingoose(MessageModel).toReturn(messages, 'find');

        const result = (await getMessages(10)) as Message[];

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dd');
      });

      test('getMessages should return an empty list if no messages are found', async () => {
        mockingoose(MessageModel).toReturn([], 'find');

        const result = (await getMessages(10)) as Message[];

        expect(result.length).toEqual(0);
      });

      test('getMessages should return an error if find throws an error', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'find');

        const result = await getMessages(10);

        expect(result).toEqual({ error: 'Error fetching messages' });
      });

      test('getMessages should return an empty list if find returns null', async () => {
        mockingoose(MessageModel).toReturn(null, 'find');

        const result = (await getMessages(10)) as Message[];

        expect(result.length).toEqual(0);
      });
    });

    describe('saveMessage', () => {
      test('saveMessage should return the saved message', async () => {
        const mockMessage: Message = {
          _id: new ObjectId(),
          content: 'This is a test message',
          sentBy: user1,
          sentDateTime: new Date('2024-06-06'),
        };

        const result = (await saveMessage(mockMessage)) as Message;

        expect(result._id).toBeDefined();
        expect(result.content).toEqual(mockMessage.content);
        expect(result.sentBy._id).toEqual(mockMessage.sentBy._id);
        expect(result.sentDateTime).toEqual(mockMessage.sentDateTime);
      });

      test('saveMessage should return an object with error if create throws an error', async () => {
        jest.spyOn(MessageModel, 'create').mockImplementationOnce(() => {
          throw new Error('error');
        });

        const result = await saveMessage({
          _id: new ObjectId(),
          content: 'This is a test message',
          sentBy: user1,
          sentDateTime: new Date('2024-06-06'),
        });

        expect(result).toEqual({ error: 'Error saving a message' });
      });
    });

    describe('updateMessage', () => {
      beforeEach(() => {
        mockingoose.resetAll();
      });
      test('updateMessage should return the updated message', async () => {
        const mockMessage: Message = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          content: 'This is a test message',
          sentBy: user1,
          sentDateTime: new Date('2024-06-06'),
        };

        const updatedMessage: Message = {
          ...mockMessage,
          content: 'This is an updated test message',
        };

        jest.spyOn(MessageModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedMessage);

        const result = (await updateMessage(mockMessage._id?.toString() as string, {
          content: 'This is an updated test message',
        })) as Message;

        expect(result._id?.toString()).toEqual(updatedMessage._id?.toString());
        expect(result.content).toEqual(updatedMessage.content);
      });

      test('updateMessage should return an error if message id is not provided', async () => {
        const result = await updateMessage('', { content: 'This is an updated test message' });

        expect(result).toEqual({ error: 'Error updating a message' });
      });

      test('updateMessage should return an error if findByIdAndUpdate throws an error', async () => {
        const mockMessage: Message = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          content: 'This is a test message',
          sentBy: user1,
          sentDateTime: new Date('2024-06-06'),
        };

        mockingoose(MessageModel).toReturn(new Error('Database error'), 'findByIdAndUpdate');

        const result = await updateMessage(mockMessage._id?.toString() as string, {
          content: 'This is an updated test message',
        });

        expect(result).toEqual({ error: 'Error updating a message' });
      });

      test('updateMessage should return an error if findByIdAndUpdate returns null', async () => {
        const mockMessage: Message = {
          _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
          content: 'This is a test message',
          sentBy: user1,
          sentDateTime: new Date('2024-06-06'),
        };

        mockingoose(MessageModel).toReturn(null, 'findByIdAndUpdate');

        const result = await updateMessage(mockMessage._id?.toString() as string, {
          content: 'This is an updated test message',
        });

        expect(result).toEqual({ error: 'Error updating a message' });
      });
    });

    describe('deleteMessage', () => {
      test('deleteMessage should return success when message is deleted', async () => {
        const mockMessageId = '65e9b58910afe6e94fc6e6dc';

        jest.spyOn(MessageModel, 'findByIdAndDelete').mockResolvedValueOnce(mockMessageId);

        const result = await deleteMessage(mockMessageId);

        expect(result).toEqual({ success: true });
      });

      test('deleteMessage should return an error if message id is not provided', async () => {
        const result = await deleteMessage('');

        expect(result).toEqual({ error: 'Error deleting a message' });
      });

      test('deleteMessage should return an error if findByIdAndDelete throws an error', async () => {
        const mockMessageId = '65e9b58910afe6e94fc6e6dc';

        mockingoose(MessageModel).toReturn(new Error('Database error'), 'findByIdAndDelete');

        const result = await deleteMessage(mockMessageId);

        expect(result).toEqual({ error: 'Error deleting a message' });
      });

      test('deleteMessage should return an error if findByIdAndDelete returns null', async () => {
        const mockMessageId = '65e9b58910afe6e94fc6e6dc';

        mockingoose(MessageModel).toReturn(null, 'findByIdAndDelete');

        const result = await deleteMessage(mockMessageId);

        expect(result).toEqual({ error: 'Error deleting a message' });
      });
    });
  });
});
