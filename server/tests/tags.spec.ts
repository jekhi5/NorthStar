import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import TagModel from '../models/tags';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const getTagCountMapSpy: jest.SpyInstance = jest.spyOn(util, 'getTagCountMap');

describe('GET /getTagsWithQuestionNumber', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return tags with question numbers', async () => {
    const mockTagCountMap = new Map<string, number>();
    mockTagCountMap.set('tag1', 2);
    mockTagCountMap.set('tag2', 1);
    getTagCountMapSpy.mockResolvedValueOnce(mockTagCountMap);

    const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'tag1', qcnt: 2 },
      { name: 'tag2', qcnt: 1 },
    ]);
  });

  it('should return error 500 if getTagCountMap returns null', async () => {
    getTagCountMapSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(500);
  });

  it('should return error 500 if getTagCountMap throws an error', async () => {
    getTagCountMapSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

    const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(500);
  });
});

describe('GET /getTagByName/:name', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a tag by name', async () => {
    const mockTag = {
      _id: new ObjectId().toString(),
      name: 'tag1',
      description: 'This is a test tag',
      subscribers: [],
    };

    mockingoose(TagModel).toReturn(mockTag, 'findOne');

    const response = await supertest(app).get('/tag/getTagByName/tag1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTag);
  });

  it('should return error 404 if tag is not found', async () => {
    mockingoose(TagModel).toReturn(null, 'findOne');

    const response = await supertest(app).get('/tag/getTagByName/tag1');

    expect(response.status).toBe(404);
  });

  it('should return error 500 if an error occurs', async () => {
    mockingoose(TagModel).toReturn(new Error('Error fetching tag'), 'findOne');

    const response = await supertest(app).get('/tag/getTagByName/tag1');

    expect(response.status).toBe(500);
  });
});
