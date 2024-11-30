import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { PostNotification, User } from '../types';
import UserModel from '../models/user';
import PostNotificationModel from '../models/postNotifications';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const saveUserSpy = jest.spyOn(util, 'saveUser');
const editUserSpy = jest.spyOn(util, 'editUser');

const user1: User = {
  _id: new ObjectId(),
  uid: 'ab53191e810c19729de860ea',
  username: 'user1',
  email: 'user1@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
  emailsEnabled: false,
};

const user2: User = {
  _id: new ObjectId(),
  uid: 'ab531bcf520c19729de860ea',
  username: 'user2',
  email: 'user2@email.com',
  status: 'Not endorsed',
  postNotifications: [],
  reputation: 0,
  emailsEnabled: false,
};

describe('GET /getUserByUid/:uid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a user by their UID', async () => {
    const mockUser = { ...user1 };

    mockingoose(UserModel).toReturn(mockUser, 'findOne');

    const response = await supertest(app).get(`/user/getUserByUid/${mockUser.uid}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...mockUser, _id: mockUser._id?.toString() });
  });

  it('should return 404 if user is not found', async () => {
    const mockUser = { ...user1 };

    mockingoose(UserModel).toReturn(null, 'findOne');

    const response = await supertest(app).get(`/user/getUserByUid/${mockUser.uid}`);

    expect(response.status).toBe(404);
  });

  it('should return 500 if an error occurs', async () => {
    const mockUser = { ...user1 };

    mockingoose(UserModel).toReturn(new Error('Error fetching user'), 'findOne');

    const response = await supertest(app).get(`/user/getUserByUid/${mockUser.uid}`);

    expect(response.status).toBe(500);
  });
});

describe('GET /checkValidUser/:username/:email', () => {
  beforeEach(() => {
    // Reset all previous mock configurations to have a clean slate for each test
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return available if username and email are not taken', async () => {
    const mockUser = { ...user1 };

    mockingoose(UserModel).toReturn(null, 'findOne');

    const response = await supertest(app).get(
      `/user/checkValidUser/${mockUser.username}/${mockUser.email}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ available: true, message: 'User is valid' });
  });

  it('should return not available if username is taken', async () => {
    const mockUser = { ...user1 };

    UserModel.findOne = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(null));

    const response = await supertest(app).get(
      `/user/checkValidUser/${mockUser.username}/${mockUser.email}`,
    );

    expect(UserModel.findOne).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ available: false, message: 'Username is already in use' });
  });

  it('should return not available if email is taken', async () => {
    const mockUser = { ...user1 };

    UserModel.findOne = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(mockUser));

    const response = await supertest(app).get(
      `/user/checkValidUser/${mockUser.username}/${mockUser.email}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      available: false,
      message: 'Email is already in use',
    });
    expect(UserModel.findOne).toHaveBeenCalledTimes(2);
  });

  it('should return not available if username and email are taken', async () => {
    const mockUser = { ...user1 };

    UserModel.findOne = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(mockUser));

    const response = await supertest(app).get(
      `/user/checkValidUser/${mockUser.username}/${mockUser.email}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      available: false,
      message: 'Both username and email are already in use',
    });
  });

  it('should return 500 if an error occurs', async () => {
    const mockUser = { ...user1 };

    UserModel.findOne = jest
      .fn()
      .mockRejectedValue(new Error('Error checking username and email availability'));

    const response = await supertest(app).get(
      `/user/checkValidUser/${mockUser.username}/${mockUser.email}`,
    );

    expect(response.status).toBe(500);
  });
});

describe('POST /addUser', () => {
  beforeEach(() => {
    // Reset all previous mock configurations to have a clean slate for each test
    mockingoose.resetAll();
    jest.clearAllMocks();
  });
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new user to the database', async () => {
    const mockUser = { ...user1 };
    const mockWelcomeNotification: PostNotification = {
      title: 'Welcome to Fake Stack Overflow!',
      text: 'Our app is still in development, so please be patient with us. Feel free to ask questions, provide answers, and reach out with any issues you encounter.',
      notificationType: 'questionPostedWithTag',
      postId: new ObjectId(),
      fromUser: user2,
    };

    mockingoose(UserModel).toReturn(mockUser, 'save');
    mockingoose(PostNotificationModel).toReturn(mockWelcomeNotification, 'findOne');
    saveUserSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).post('/user/addUser').send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ ...mockUser, _id: mockUser._id?.toString() });
  });

  it('should add a new user to the database even if finding the welcome notification fails', async () => {
    const mockUser = { ...user1 };

    PostNotificationModel.findOne = jest
      .fn()
      .mockRejectedValue(new Error('Error fetching welcome notification'));
    saveUserSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).post('/user/addUser').send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ ...mockUser, _id: mockUser._id?.toString() });
  });

  it('should return 500 if an error occurs', async () => {
    const mockUser = { ...user1 };

    saveUserSpy.mockResolvedValueOnce({ error: 'Error adding user' });

    const response = await supertest(app).post('/user/addUser').send(mockUser);

    expect(response.status).toBe(500);
  });

  it('should return 400 if the user data is invalid', async () => {
    const mockUser = { ...user1, username: '' };

    const response = await supertest(app).post('/user/addUser').send(mockUser);

    expect(response.status).toBe(400);
  });

  it('should return 400 if the user data is invalid', async () => {
    const mockUser = { ...user1, uid: '' };

    const response = await supertest(app).post('/user/addUser').send(mockUser);

    expect(response.status).toBe(400);
  });

  it('should return 400 if the user data is invalid', async () => {
    const mockUser = { ...user1, email: '' };

    const response = await supertest(app).post('/user/addUser').send(mockUser);

    expect(response.status).toBe(400);
  });
});

describe('PUT /updateUser', () => {
  beforeEach(() => {
    // Reset all previous mock configurations to have a clean slate for each test
    mockingoose.resetAll();
    jest.clearAllMocks();
  });
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should update a user in the database', async () => {
    const mockUser = { ...user1 };

    editUserSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).put('/user/updateUser').send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ ...mockUser, _id: mockUser._id?.toString() });
  });

  it('should return 500 if an error occurs', async () => {
    const mockUser = { ...user1 };

    editUserSpy.mockResolvedValueOnce({ error: 'Error updating user' });

    const response = await supertest(app).put('/user/updateUser').send(mockUser);

    expect(response.status).toBe(500);
  });

  it('should return 400 if the user data is invalid', async () => {
    const mockUser = { ...user1, username: '' };

    const response = await supertest(app).put('/user/updateUser').send(mockUser);

    expect(response.status).toBe(400);
  });

  it('should return 400 if the user data is invalid', async () => {
    const mockUser = { ...user1, email: '' };

    const response = await supertest(app).put('/user/updateUser').send(mockUser);

    expect(response.status).toBe(400);
  });

  it('should return 400 if the user data is invalid', async () => {
    const mockUser = { ...user1, uid: '' };

    const response = await supertest(app).put('/user/updateUser').send(mockUser);

    expect(response.status).toBe(400);
  });
});
