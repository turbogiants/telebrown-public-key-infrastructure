const request = require('supertest');
const config = require('../config/config');
const createApp = require('../app');
const logging = require('../config/logging');
const NAMESPACE = 'App Test';

const testToken = config.keys.access_token;

// mock functions
const createUser = jest.fn();
const getUser = jest.fn();
const updateExisting = jest.fn();
const idExists = jest.fn();

const app = createApp({
    createUser,
    getUser,
    idExists,
    updateExisting
});

describe('POST /create', () => {
    beforeEach(() => {
        createUser.mockReset();
        updateExisting.mockReset();
    });

    describe('when given an id, firstname and lastname', () => {
        // should save the entry to the database
        // should respond with a json object containing the entry and a success flag
        // should respond with 200 status code
        // should specify json in content type header

        it('should save the entry to the database', async () => {
            const testData = [
                { _id: 1, firstname: 'john', lastname: 'doe' },
                { _id: 2, firstname: 'jack', lastname: 'roe' },
                { _id: 3, firstname: 'nice', lastname: 'one' }
            ];

            // test 3 sets of data
            for (const body of testData) {
                // reset mock state before each test
                createUser.mockReset();
                createUser.mockResolvedValue(body);

                // make the request
                const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(body);

                // expectations
                expect(createUser.mock.calls.length).toBe(1);
                expect(createUser.mock.calls[0][0]).toEqual(body);
            }
        });

        it('should respond with a json object containing a true success prop and the data sent', async () => {
            const testData = [
                { _id: 1, firstname: 'john', lastname: 'doe' },
                { _id: 2, firstname: 'jack', lastname: 'roe' },
                { _id: 3, firstname: 'nice', lastname: 'one' }
            ];

            for (const body of testData) {
                createUser.mockReset();
                createUser.mockResolvedValue(body);
                idExists.mockResolvedValue(false);

                const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(body);
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
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue(testData);
            idExists.mockResolvedValue(false);

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(testData);

            expect(response.statusCode).toBe(201);
        });

        it('should specify json in the content type header', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue(testData);
            idExists.mockReset();
            idExists.mockResolvedValue(false);

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(testData);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
    });
    // TODO: when body is missing
    describe('when the id, firstname and/or lastname is missing', () => {
        // should return 400 status code
        // should return error message
        it('should return 400 status code', async () => {
            // test data with different composition of invalidity
            const testData = [{}, { firstname: 'john', lastname: 'doe' }, { _id: 1, lastname: 'doe' }, { _id: 1, firstname: 'john' }];

            for (const body of testData) {
                createUser.mockReset();
                createUser.mockResolvedValue(body);

                const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(body);

                expect(response.statusCode).toBe(400);
            }
        });

        it('should send a json object with a message and error object', async () => {
            // test data with different composition of invalidity
            const testData = [{}, { firstname: 'john', lastname: 'doe' }, { _id: 1, lastname: 'doe' }, { _id: 1, firstname: 'john' }];

            for (const body of testData) {
                createUser.mockReset();
                createUser.mockResolvedValue(body);

                const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(body);

                expect(response.body).toEqual({
                    message: 'Bad Request. Request body is invalid.',
                    error: expect.any(Object)
                });
            }
        });
    });
    // TODO: when id already exists
    describe('when given an id that already exists', () => {
        // should return a 200 status code
        // should respond with a message and the object containing the data
        it('should return a 200 status code', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            updateExisting.mockReset();
            updateExisting.mockResolvedValue(testData);

            idExists.mockReset();
            idExists.mockResolvedValue(true);

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(testData);

            expect(response.statusCode).toBe(200);
        });

        it('should respond with a message and the object containing the data', async () => {
            const testData = [
                { _id: 1, firstname: 'john', lastname: 'doe' },
                { _id: 2, firstname: 'jack', lastname: 'roe' },
                { _id: 3, firstname: 'nice', lastname: 'one' }
            ];

            for (const body of testData) {
                updateExisting.mockReset();
                updateExisting.mockResolvedValue(body);
                idExists.mockReset();
                idExists.mockResolvedValue(true);

                const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer ${testToken}`).send(body);
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
        it('should return a 401 status code', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/debug/create').send(testData);

            expect(response.statusCode).toBe(401);
        });

        it('should return a json response with a message and error object as props', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/debug/create').send(testData);

            expect(response.body).toEqual({
                message: 'Endpoint forbidden. Missing Authorization header.',
                error: expect.any(Object)
            });
        });
    });

    describe('when given a request with an invalid Authorization header', () => {
        it('should return a 403 status code', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.statusCode).toBe(403);
        });

        it('should return a json with a message and the error object as props', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue(testData);

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.body).toEqual({
                message: 'Access Token is invalid.',
                error: expect.any(Object)
            });
        });
    });
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
                { _id: '12345', firstname: 'aevan', lastname: 'cande' },
                { _id: '12346', firstname: 'john', lastname: 'doe' },
                { _id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                await request(app).get(`/api/debug/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(getUser.mock.calls.length).toBe(1);
                expect(getUser.mock.calls[0][0]).toEqual(param._id);
            }
        });
        it('should respond with json containing success flag, success message and data', async () => {
            const testData = [
                { _id: '12345', firstname: 'aevan', lastname: 'cande' },
                { _id: '12346', firstname: 'john', lastname: 'doe' },
                { _id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                const response = await request(app).get(`/api/debug/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

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
                { _id: '12345', firstname: 'aevan', lastname: 'cande' },
                { _id: '12346', firstname: 'john', lastname: 'doe' },
                { _id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                const response = await request(app).get(`/api/debug/user/${param.id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(response.statusCode).toBe(201);
            }
        });
        it('should specify json in content type header', async () => {
            const testData = [
                { _id: '12345', firstname: 'aevan', lastname: 'cande' },
                { _id: '12346', firstname: 'john', lastname: 'doe' },
                { _id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue(param);

                const response = await request(app).get(`/api/debug/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            }
        });
    });

    describe('when given a request with no authorization header', () => {
        it('should respond with a 401 status code', async () => {
            const testData = { _id: '12345', firstname: 'aevan', lastname: 'cande' };
            getUser.mockReset();
            getUser.mockResolvedValue(testData);

            const response = await request(app).get(`/api/debug/user/${param._id}`).send();

            expect(response.statusCode).toBe(401);
        });

        it('should return a json response with a message and the error object as props', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

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

            const response = await request(app).post('/api/debug/create').send(testData);

            expect(response.body).toEqual({
                message: 'Endpoint forbidden. Missing Authorization header.',
                error: expect.any(Object)
            });
        });
    });

    describe('when given a request with an invalid Authorization header', () => {
        it('should return a 403 status code', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

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

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.statusCode).toBe(403);
        });

        it('should return a json with a message and the error object as props', async () => {
            const testData = { _id: 1, firstname: 'john', lastname: 'doe' };

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

            const response = await request(app).post('/api/debug/create').set('Authorization', `Bearer 12345`).send(testData);

            expect(response.body).toEqual({
                message: 'Access Token is invalid.',
                error: expect.any(Object)
            });
        });
    });
});
