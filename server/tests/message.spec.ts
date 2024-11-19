import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Message, User } from '../types';

const getMessagesSpy = jest.spyOn(util, 'getMessages');
const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const updateMessageSpy = jest.spyOn(util, 'updateMessage');
const deleteMessageSpy = jest.spyOn(util, 'deleteMessage');

const user1: User = {
  _id: new ObjectId('ab53191e810c19729de860ea'),
  uid: 'ab53191e810c19729de860ea',
  username: 'user1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

const user2: User = {
  uid: 'ab531bcf520c19729de860ea',
  username: 'user2',
  email: 'user2@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
};

interface MockResponse {
  msg: string;
  upVotes: string[];
  downVotes: string[];
}

// There are 25 of them
const MOCK_MESSAGES: Message[] = [
  {
    _id: new ObjectId(),
    content: 'Message 1',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:00:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 2',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:01:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 3',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:02:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 4',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:03:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 5',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:04:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 6',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:05:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 7',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:06:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 8',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:07:00Z'),
  },

  {
    _id: new ObjectId(),
    content: 'Message 9',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:08:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 10',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:09:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 11',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:10:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 12',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:11:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 13',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:12:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 14',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:13:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 15',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:14:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 16',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:15:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 17',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:16:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 18',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:17:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 19',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:18:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 20',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:19:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 21',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:20:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 22',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:21:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 23',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:22:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 24',
    sentBy: user2,
    sentDateTime: new Date('2024-06-03T12:23:00Z'),
  },
  {
    _id: new ObjectId(),
    content: 'Message 25',
    sentBy: user1,
    sentDateTime: new Date('2024-06-03T12:24:00Z'),
  },
];

describe('GET /getMessages', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should get the most recent messages, trimmed to limit below 20', async () => {
    const limit = 10;

    const expectedMessages = MOCK_MESSAGES.reverse().slice(0, limit);

    // The last 10 messages are the most recent
    getMessagesSpy.mockResolvedValueOnce(expectedMessages);

    const response = await supertest(app).get('/chat/getMessages').send(limit.toString());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expectedMessages.map(message => ({
        ...message,
        _id: message._id?.toString(),
        sentBy: { ...message.sentBy, _id: message.sentBy._id?.toString() },
        sentDateTime: message.sentDateTime.toISOString(),
      })),
    );
  });

  it('should get the most recent messages, trimmed to limit above 20', async () => {
    const limit = 23;

    const expectedMessages = MOCK_MESSAGES.reverse().slice(0, limit);

    // The last 10 messages are the most recent
    getMessagesSpy.mockResolvedValueOnce(expectedMessages);

    const response = await supertest(app).get('/chat/getMessages').send(limit.toString());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expectedMessages.map(message => ({
        ...message,
        _id: message._id?.toString(),
        sentBy: { ...message.sentBy, _id: message.sentBy._id?.toString() },
        sentDateTime: message.sentDateTime.toISOString(),
      })),
    );
  });

  it('should get the most recent messages, trimmed to 20 when limit not provided', async () => {
    const expectedMessages = MOCK_MESSAGES.reverse().slice(0, 20);

    getMessagesSpy.mockResolvedValueOnce(expectedMessages);

    const response = await supertest(app).get('/chat/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expectedMessages.map(message => ({
        ...message,
        _id: message._id?.toString(),
        sentBy: { ...message.sentBy, _id: message.sentBy._id?.toString() },
        sentDateTime: message.sentDateTime.toISOString(),
      })),
    );
  });

  it('should return 500 error if getMessages returns with error', async () => {
    const limit = 10;

    getMessagesSpy.mockResolvedValueOnce({ error: 'Failed to load messages' });

    const response = await supertest(app).get('/chat/getMessages').send(limit.toString());

    expect(response.status).toBe(500);
  });
});

describe('POST /sendMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new message to the chatroom', async () => {
    const newMessage = {
      _id: new ObjectId(),
      content: 'Message 26',
      sentBy: user1,
      sentDateTime: new Date('2024-06-03T12:25:00Z'),
    };

    saveMessageSpy.mockResolvedValueOnce(newMessage);

    const response = await supertest(app).post('/chat/sendMessage').send(newMessage);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...newMessage,
      _id: newMessage._id?.toString(),
      sentBy: { ...newMessage.sentBy, _id: newMessage.sentBy._id?.toString() },
      sentDateTime: newMessage.sentDateTime.toISOString(),
    });
  });

  it('should return 400 error if message data is missing message content', async () => {
    const newMessage = {
      _id: new ObjectId(),
      sentBy: user1,
      sentDateTime: new Date('2024-06-03T12:25:00Z'),
    };

    const response = await supertest(app).post('/chat/sendMessage').send(newMessage);

    expect(response.status).toBe(400);
  });

  it('should return 400 error if message data is missing message sentBy', async () => {
    const newMessage = {
      _id: new ObjectId(),
      content: 'Message 26',
      sentDateTime: new Date('2024-06-03T12:25:00Z'),
    };
    const response = await supertest(app).post('/chat/sendMessage').send(newMessage);

    expect(response.status).toBe(400);
  });

  it('should return 400 error if message data is missing message sentDateTime', async () => {
    const newMessage = {
      _id: new ObjectId(),
      content: 'Message 26',
      sentBy: user1,
    };
    const response = await supertest(app).post('/chat/sendMessage').send(newMessage);

    expect(response.status).toBe(400);
  });

  it('should return 500 error if saveMessage returns an error', async () => {
    const newMessage = {
      _id: new ObjectId(),
      content: 'Message 26',
      sentBy: user1,
      sentDateTime: new Date('2024-06-03T12:25:00Z'),
    };

    saveMessageSpy.mockResolvedValueOnce({ error: 'Failed to save message' });

    const response = await supertest(app).post('/chat/sendMessage').send(newMessage);

    expect(response.status).toBe(500);
  });
});

describe('PUT /updateMessage/:id', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a message by ID', async () => {
    const updatedMessage = {
      _id: new ObjectId(),
      content: 'Updated Message 26',
      sentBy: user1,
      sentDateTime: new Date('2024-06-03T12:25:00Z'),
    };

    updateMessageSpy.mockResolvedValueOnce(updatedMessage);

    const response = await supertest(app)
      .put(`/chat/updateMessage/${updatedMessage._id}`)
      .send(updatedMessage);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...updatedMessage,
      _id: updatedMessage._id?.toString(),
      sentBy: { ...updatedMessage.sentBy, _id: updatedMessage.sentBy._id?.toString() },
      sentDateTime: updatedMessage.sentDateTime.toISOString(),
    });
  });

  it('should return 500 error if updateMessage returns an error', async () => {
    const updatedMessage = {
      _id: new ObjectId(),
      sentBy: user1,
      sentDateTime: new Date('2024-06-03T12:25:00Z'),
    };

    updateMessageSpy.mockResolvedValueOnce({ error: 'Failed to update message' });

    const response = await supertest(app)
      .put(`/chat/updateMessage/${updatedMessage._id}`)
      .send(updatedMessage);

    expect(response.status).toBe(500);
  });
});

describe('DELETE /deleteMessage/:id', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should delete a message by ID', async () => {
    const deletedMessageId = MOCK_MESSAGES[0]._id;

    deleteMessageSpy.mockResolvedValueOnce({ success: true });

    const response = await supertest(app).delete(`/chat/deleteMessage/${deletedMessageId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  it('should return 500 error if deleteMessage returns an error', async () => {
    const deletedMessageId = MOCK_MESSAGES[0]._id;

    deleteMessageSpy.mockResolvedValueOnce({ error: 'Failed to delete message' });

    const response = await supertest(app).delete(`/chat/deleteMessage/${deletedMessageId}`);

    expect(response.status).toBe(500);
  });
});
