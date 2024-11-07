import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import TagModel from '../models/tags';

// Spy on the TagModel.findOne method
const findOneSpy = jest.spyOn(TagModel, 'findOne');

describe('GET /getTagByName/:name', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    findOneSpy.mockClear(); // Clear the mock after each test
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the tag when found', async () => {
    // Mock a tag object to be returned by the findOne method
    const mockTag = { name: 'exampleTag', description: 'This is a test tag' };
    findOneSpy.mockResolvedValueOnce(mockTag);

    const response = await supertest(app).get('/tag/getTagByName/exampleTag');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTag);
  });

  it('should return 404 if the tag is not found', async () => {
    // Mock findOne to return null to simulate tag not found
    findOneSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get('/tag/getTagByName/nonExistentTag');

    expect(response.status).toBe(404);
    expect(response.text).toBe('Tag with name "nonExistentTag" not found');
  });

  it('should return 500 if there is an error fetching the tag', async () => {
    // Mock findOne to throw an error
    findOneSpy.mockRejectedValueOnce(new Error('Error fetching tag'));

    const response = await supertest(app).get('/tag/getTagByName/errorTag');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching tag: Error fetching tag');
  });
});
