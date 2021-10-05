const request = require('supertest');
const config = require('../config/config');
const createApp = require('../app');
const logging = require('../config/logging');
const NAMESPACE = 'User Test';

const testToken = config.keys.access_token;

// mock functions
const { getUser, idExists } = require('./mockDatabase');

const app = createApp({
    getUser,
    idExists
});

describe('GET /user/:id', () => {
    beforeEach(() => {
        getUser.mockReset();
        idExists.mockReset();
    });

    describe('when given an id that exists', () => {
        // should call the database to fetch
        // should respond with json containing success flag, success message and data
        it('should fetch data from database', async () => {
            const testData = [
                { _id: '1234567891234567', firstname: 'aevan', lastname: 'cande' },
                { _id: '1234567891234567', firstname: 'john', lastname: 'doe' },
                { _id: '1234567891234567', firstname: 'jack', lastname: 'roe' }
            ];

            for (param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                await request(app).get(`/api/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(getUser.mock.calls.length).toBe(1);
                expect(getUser.mock.calls[0][0]).toEqual(param._id);
            }
        });
        it('should respond with json containing success flag, success message and data', async () => {
            const testData = [
                { _id: '1234567891234567', firstname: 'aevan', lastname: 'cande' },
                { _id: '1234567891234567', firstname: 'john', lastname: 'doe' },
                { _id: '1234567891234567', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                const response = await request(app).get(`/api/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(response.body).toEqual({
                    message: 'Query Success',
                    data: {
                        _id: param._id,
                        firstname: param.firstname,
                        lastname: param.lastname
                    }
                });
            }
        });
        it('should respond with 201 status code', async () => {
            const testData = [
                { _id: '1234567891234567', firstname: 'aevan', lastname: 'cande' },
                { _id: '1234567891234567', firstname: 'john', lastname: 'doe' },
                { _id: '1234567891234567', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                const response = await request(app).get(`/api/user/${param.id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(response.statusCode).toBe(201);
            }
        });
        it('should specify json in content type header', async () => {
            const testData = [
                { _id: '1234567891234567', firstname: 'aevan', lastname: 'cande' },
                { _id: '1234567891234567', firstname: 'john', lastname: 'doe' },
                { _id: '1234567891234567', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                const response = await request(app).get(`/api/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            }
        });
    });

    describe('when given a request with no authorization header', () => {
        it('should respond with a 401 status code', async () => {
            const testData = { _id: '1234567891234567', firstname: 'aevan', lastname: 'cande' };
            getUser.mockReset();
            getUser.mockResolvedValue(testData);

            const response = await request(app).get(`/api/user/${param._id}`).send();

            expect(response.statusCode).toBe(401);
        });

        it('should return a json response with a message and the error object as props', async () => {
            const testData = { _id: '1234567891234567', firstname: 'john', lastname: 'doe' };

            getUser.mockReset();
            getUser.mockResolvedValue({
                success: true,
                message: 'Query Successful',
                data: {
                    id: param._id,
                    firstname: param.firstname,
                    lastname: param.lastname
                }
            });

            const response = await request(app).post('/api/user').send(testData);

            expect(response.body).toEqual({
                message: 'Endpoint forbidden. Missing Authorization header.',
                error: expect.any(Object)
            });
        });
    });

    describe('when given a request with an invalid Authorization header', () => {
        it('should return a 403 status code', async () => {
            const testData = { _id: '1234567891234567', firstname: 'john', lastname: 'doe' };

            getUser.mockReset();
            getUser.mockResolvedValue({
                success: true,
                message: 'Query Successful',
                data: {
                    id: param._id,
                    firstname: param.firstname,
                    lastname: param.lastname
                }
            });

            const response = await request(app).post('/api/user').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.statusCode).toBe(403);
        });

        it('should return a json with a message and the error object as props', async () => {
            const testData = { _id: '1234567891234567', firstname: 'john', lastname: 'doe' };

            getUser.mockReset();
            getUser.mockResolvedValue({
                success: true,
                message: 'Query Successful',
                data: {
                    id: param._id,
                    firstname: param.firstname,
                    lastname: param.lastname
                }
            });

            const response = await request(app).post('/api/user').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.body).toEqual({
                message: 'Access Token is invalid.',
                error: expect.any(Object)
            });
        });
    });
});
