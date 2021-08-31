const request = require('supertest');
const createApp = require('../app');
const logging = require('../config/logging');
const NAMESPACE = 'App Test';

// mock functions
const createUser = jest.fn();
const getUser = jest.fn();
const idExists = jest.fn();

const app = createApp({
    createUser,
    getUser,
    idExists
});

describe('POST /create', () => {
    beforeEach(() => {
        createUser.mockReset();
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

                // make the request
                const response = await request(app).post('/api/debug/create').send(body);

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
                createUser.mockResolvedValue({
                    success: true,
                    message: 'User created successfully',
                    data: body
                });
                idExists.mockResolvedValue(false);

                const response = await request(app).post('/api/debug/create').send(body);
                expect(response.body).toEqual({
                    success: true,
                    message: 'User created successfully',
                    data: {
                        id: body._id,
                        firstname: body.firstname,
                        lastname: body.lastname
                    }
                });
            }
        });

        it('should respond with 201 status code', async () => {
            const body = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue({
                success: true,
                message: 'User created successfully',
                data: body
            });
            idExists.mockResolvedValue(false);

            const response = await request(app).post('/api/debug/create').send(body);

            expect(response.statusCode).toBe(201);
        });

        it('should specify json in the content type header', async () => {
            const body = { _id: 1, firstname: 'john', lastname: 'doe' };

            createUser.mockReset();
            createUser.mockResolvedValue({
                success: true,
                message: 'User created successfully',
                data: body
            });
            idExists.mockResolvedValue(false);

            const response = await request(app).post('/api/debug/create').send(body);

            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
    });

    describe('when the id, firstname and lastname is missing', () => {
        // should return 400 status code
        // should return error message
        it.todo('should return 401 status code');
    });

    describe('when given an id that already exists', () => {
        it.todo('should return 422 status code');
        it.todo('should respond with an object containt success flag, message, and error object');
    });

    // TODO: error tests
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
                { id: '12345', firstname: 'aevan', lastname: 'cande' },
                { id: '12346', firstname: 'john', lastname: 'doe' },
                { id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue({
                    success: true,
                    message: 'Query Successful',
                    data: {
                        id: param.id,
                        firstname: param.firstname,
                        lastname: param.lastname
                    }
                });

                await request(app).get(`/api/debug/user/${param.id}`).send();

                expect(getUser.mock.calls.length).toBe(1);
                expect(getUser.mock.calls[0][0]).toEqual(param.id);
            }
        });
        it('should respond with json containing success flag, success message and data', async () => {
            const testData = [
                { id: '12345', firstname: 'aevan', lastname: 'cande' },
                { id: '12346', firstname: 'john', lastname: 'doe' },
                { id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue({
                    _id: param.id,
                    firstname: param.firstname,
                    lastname: param.lastname
                });

                const response = await request(app).get(`/api/debug/user/${param.id}`).send();

                expect(response.body).toEqual({
                    success: true,
                    message: 'Query Success',
                    data: {
                        id: param.id,
                        firstname: param.firstname,
                        lastname: param.lastname
                    }
                });
            }
        });
        it('should respond with 201 status code', async () => {
            const testData = [
                { id: '12345', firstname: 'aevan', lastname: 'cande' },
                { id: '12346', firstname: 'john', lastname: 'doe' },
                { id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue({
                    _id: param.id,
                    firstname: param.firstname,
                    lastname: param.lastname
                });

                const response = await request(app).get(`/api/debug/user/${param.id}`).send();

                expect(response.statusCode).toBe(201);
            }
        });
        it('should specify json in content type header', async () => {
            const testData = [
                { id: '12345', firstname: 'aevan', lastname: 'cande' },
                { id: '12346', firstname: 'john', lastname: 'doe' },
                { id: '12347', firstname: 'jack', lastname: 'roe' }
            ];

            for (const param of testData) {
                getUser.mockReset();
                getUser.mockResolvedValue({
                    _id: param.id,
                    firstname: param.firstname,
                    lastname: param.lastname
                });

                const response = await request(app).get(`/api/debug/user/${param.id}`).send();

                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            }
        });
    });
});
