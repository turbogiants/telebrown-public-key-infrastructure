const request = require('supertest');
const config = require('../config/config');
const createApp = require('../app');
const logging = require('../config/logging');
const NAMESPACE = 'Key Test';

const testToken = config.keys.access_token;

// mock functions
const idExists = jest.fn();
const updatePublicKey = jest.fn();

const app = createApp({
    idExists,
    updatePublicKey
});

describe('POST /key', () => {
    // endpoint string
    const postKeyRoute = '/api/key';

    beforeEach(() => {
        // mock function reset
        idExists.mockReset();
        updatePublicKey.mockReset();
    });

    describe('when given a valid key and the user exists', () => {
        // should check if id exists and save to database
        // should respond with a json object containing a message and the key
        // should respond with 201 status code
        // should specify json in content type header

        // test body
        const testData = [
            { _id: '1', public_key: '1234567812345678' },
            { _id: '2', public_key: '2345678923456789' },
            { _id: '3', public_key: '3456789123456789' }
        ];

        it('should save to database', async () => {
            for (const body of testData) {
                // mock reset
                idExists.mockReset();
                updatePublicKey.mockReset();

                // mock resolve values
                idExists.mockResolvedValue(true);
                updatePublicKey.mockResolvedValue(body);
                // make the request
                await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(body);

                // check if id exists test
                expect(idExists.mock.calls.length).toBe(1);
                expect(idExists.mock.calls[0][0]).toEqual(body._id);

                // save to database test
                expect(updatePublicKey.mock.calls.length).toBe(1);
                expect(updatePublicKey.mock.calls[0][0]).toEqual(body._id);
                expect(updatePublicKey.mock.calls[0][1]).toEqual(body.public_key);
            }
        });

        it('should respond with a json object containing a message and the key', async () => {
            for (const body of testData) {
                // mock reset
                idExists.mockReset();
                updatePublicKey.mockReset();

                // mock resolve values
                idExists.mockResolvedValue(true);
                updatePublicKey.mockResolvedValue(body);
                // make the request
                const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(body);

                // json response with message and data
                expect(response.body).toEqual({
                    message: 'Public Key updated successfully.',
                    data: body
                });
            }
        });

        it('should respond with 201 status code', async () => {
            for (const body of testData) {
                // mock reset
                idExists.mockReset();
                updatePublicKey.mockReset();

                // mock resolve values
                idExists.mockResolvedValue(true);
                updatePublicKey.mockResolvedValue(body);
                // make the request
                const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(body);

                // status code of 201
                expect(response.statusCode).toBe(201);
            }
        });

        it('should specify json in content type header', async () => {
            for (const body of testData) {
                // mock reset
                idExists.mockReset();
                updatePublicKey.mockReset();

                // mock resolve values
                idExists.mockResolvedValue(true);
                updatePublicKey.mockResolvedValue(body);
                // make the request
                const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(body);

                // json in content type header
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            }
        });
    });

    describe('when given an invalid key', () => {
        // should return status code 400 bad request
        // should return a json object with message and error object

        // test body
        const testData = [
            {
                _id: 1,
                public_key: 'abce1234fghi4567' // key is not numeric
            },
            {
                _id: 1,
                public_key: '123456789123456' // key is not 16 length
            },
            {
                _id: 1,
                public_key: 12345 // key is not a string
            }
        ];

        it('should return status code 400', async () => {
            for (const body of testData) {
                // mock database
                idExists.mockReset();
                idExists.mockResolvedValue(true);

                // make request
                const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(body);

                // expect
                expect(response.statusCode).toBe(400);
            }
        });

        it('should return a json object with message and error object', async () => {
            for (const body of testData) {
                // mock database
                idExists.mockReset();
                idExists.mockResolvedValue(true);

                // make request
                const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(body);

                // expect
                expect(response.body).toEqual({
                    message: 'Public Key is invalid.',
                    error: expect.any(Object)
                });
            }
        });
    });

    describe('when given id does not exist', () => {
        // should return status code 400
        // should return a json object with message and error object

        // test data
        const testData = {
            _id: '1',
            public_key: '1234567891234567'
        };

        it('should return status code 400', async () => {
            // mock database
            idExists.mockReset();
            idExists.mockResolvedValue(false);

            // make request
            const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(testData);

            // expect
            expect(response.statusCode).toBe(400);
        });

        it('should return a json object with message and error object', async () => {
            // mock database
            idExists.mockReset();
            idExists.mockResolvedValue(false);

            // make request
            const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer ${testToken}`).send(testData);

            // expect
            expect(response.body).toEqual({
                message: 'This user does not exist in the database.',
                error: expect.any(Object)
            });
        });
    });

    describe('when given a request with no Authorization header', () => {
        // should return a 401 status code
        // should return a json response with a message and error object as props

        it('should return a 401 status code', async () => {
            // make request
            const response = await request(app).post(postKeyRoute).send();

            // expected
            expect(response.statusCode).toBe(401);
        });

        it('should return a json response with a message and error object as props', async () => {
            // make request
            const response = await request(app).post(postKeyRoute).send();

            // expected
            expect(response.body).toEqual({
                message: 'Endpoint forbidden. Missing Authorization header.',
                error: expect.any(Object)
            });
        });
    });

    describe('when given a request with an invalid Authorization header', () => {
        // should return a 403 status code
        // should return a json response with a message and error object as props

        it('should return a 403 status code', async () => {
            // make request
            const response = await request(app).post(postKeyRoute).set('Authorization', `Bearer 12345`).send();

            // expected
            expect(response.statusCode).toBe(403);
        });
    });
});
