const request = require('supertest');
const config = require('../config/config');
const createApp = require('../app');
const logging = require('../config/logging');
const NAMESPACE = 'User Test';

const testToken = config.keys.access_token;

// mock functions
const { createUser, updateExisting, idExists } = require('./mockDatabase');

const app = createApp({
    createUser,
    updateExisting,
    idExists
});
// TODO: add ID validation in POST /user
describe('POST /user', () => {
    beforeEach(() => {
        createUser.mockReset();
        updateExisting.mockReset();
        idExists.mockReset();
    });

    describe('when given an id, firstname and lastname', () => {
        // should save the entry to the database
        // should respond with a json object containing the entry and a success flag
        // should respond with 201 status code
        // should specify json in content type header

        // test body
        const testData = [
            { _id: '1234567891234567', firstname: 'john', lastname: 'doe' },
            { _id: '2345678912345678', firstname: 'jack', lastname: 'roe' },
            { _id: '3456789123456789', firstname: 'nice', lastname: 'one' }
        ];

        it('should save the entry to the database', async () => {
            // test 3 sets of data
            for (const body of testData) {
                // reset mock state before each test
                createUser.mockReset();
                createUser.mockResolvedValue(body);

                // make the request
                await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);

                // expectations
                expect(createUser.mock.calls.length).toBe(1);
                expect(createUser.mock.calls[0][0]).toEqual(body);
            }
        });

        it('should respond with a json object containing a true success prop and the data sent', async () => {
            for (const body of testData) {
                createUser.mockReset();
                createUser.mockResolvedValue(body);
                idExists.mockResolvedValue(false);

                const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);
                expect(response.body).toEqual({
                    message: 'User created successfully',
                    data: {
                        _id: body._id,
                        firstname: body.firstname,
                        lastname: body.lastname
                    }
                });
            }
        });

        it('should respond with 201 status code', async () => {
            const body = testData[0];

            createUser.mockReset();
            createUser.mockResolvedValue(body);
            idExists.mockResolvedValue(false);

            const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);

            expect(response.statusCode).toBe(201);
        });

        it('should specify json in the content type header', async () => {
            const body = testData[0];

            createUser.mockReset();
            createUser.mockResolvedValue(body);
            idExists.mockReset();
            idExists.mockResolvedValue(false);

            const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
    });

    describe('when the id, firstname and/or lastname is missing', () => {
        // should return 400 status code
        // should return error message

        // test data with different composition of invalidity
        const testData = [{}, { firstname: 'john', lastname: 'doe' }, { _id: '1234567891234567', lastname: 'doe' }, { _id: '1234567891234567', firstname: 'john' }];

        it('should return 400 status code', async () => {
            for (const body of testData) {
                createUser.mockReset();
                createUser.mockResolvedValue(body);

                const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);

                expect(response.statusCode).toBe(400);
            }
        });

        it('should send a json object with a message and error object', async () => {
            for (const body of testData) {
                createUser.mockReset();
                createUser.mockResolvedValue(body);

                const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);

                expect(response.body).toEqual({
                    message: 'Bad Request. Request body is invalid.',
                    error: expect.any(Object)
                });
            }
        });
    });

    describe('when given an id that already exists', () => {
        // should return a 200 status code
        // should respond with a message and the object containing the data
        it('should return a 200 status code', async () => {
            const testData = { _id: '1234567891234567', firstname: 'john', lastname: 'doe' };

            updateExisting.mockReset();
            updateExisting.mockResolvedValue(testData);

            idExists.mockReset();
            idExists.mockResolvedValue(true);

            const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(testData);

            expect(response.statusCode).toBe(200);
        });

        it('should respond with a message and the object containing the data', async () => {
            const testData = [
                { _id: '1234567891234567', firstname: 'john', lastname: 'doe' },
                { _id: '2345678912345678', firstname: 'jack', lastname: 'roe' },
                { _id: '3456789123456789', firstname: 'nice', lastname: 'one' }
            ];

            for (const body of testData) {
                updateExisting.mockReset();
                updateExisting.mockResolvedValue(body);
                idExists.mockReset();
                idExists.mockResolvedValue(true);

                const response = await request(app).post('/api/user').set('Authorization', `Bearer ${testToken}`).send(body);
                expect(response.body).toEqual({
                    message: 'User updated successfully',
                    data: {
                        _id: body._id,
                        firstname: body.firstname,
                        lastname: body.lastname
                    }
                });
            }
        });
    });

    describe('when given a request with no Authorization header', () => {
        // test body
        const testData = { _id: '1234567891234567', firstname: 'john', lastname: 'doe' };

        it('should return a 401 status code', async () => {
            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/user').send(testData);

            expect(response.statusCode).toBe(401);
        });

        it('should return a json response with a message and error object as props', async () => {
            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/user').send(testData);

            expect(response.body).toEqual({
                message: 'Endpoint forbidden. Missing Authorization header.',
                error: expect.any(Object)
            });
        });
    });

    describe('when given a request with an invalid Authorization header', () => {
        // test data
        const testData = { _id: '1234567891234567', firstname: 'john', lastname: 'doe' };

        it('should return a 403 status code', async () => {
            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/user').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.statusCode).toBe(403);
        });

        it('should return a json with a message and the error object as props', async () => {
            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/user').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.body).toEqual({
                message: 'Access Token is invalid.',
                error: expect.any(Object)
            });
        });
    });
});
