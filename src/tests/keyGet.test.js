const request = require('supertest');
const config = require('../config/config');
const createApp = require('../app');
const logging = require('../config/logging');
const NAMESPACE = 'Key Test';

const testToken = config.keys.access_token;

// mock functions
const { getPublicKey } = require('./mockDatabase');

const app = createApp({ getPublicKey });

describe('GET /key', () => {
    beforeEach(() => {
        getPublicKey.mockReset();
    });

    describe('when given a valid ID', () => {
        // should fetch from database
        // should respond with json object with message and public_key and id
        // should respond with 201 status code
        // should specify json in content type header

        // test body and response
        const testData = [
            { _id: '1234567891234567', public_key: 'public1' },
            { _id: '1234567891234567', public_key: 'public2' },
            { _id: '1234567891234567', public_key: 'public3' }
        ];

        // it('should fetch from database', async () => {
        //     for (param of testData) {
        //         getPublicKey.mockReset();
        //         getPublicKey.mockResolvedValue(param);

        //         await request(app).get(`/api/user/${param._id}`).set('Authorization', `Bearer ${testToken}`).send();

        //         expect(getPublicKey.mock.calls.length).toBe(1);
        //         expect(getPublicKey.mock.calls[0][0]).toEqual(param._id);
        //     }
        // });

        it.todo('should respond with json object with message and public_key and id');

        it.todo('should respond with 201 status code');

        it.todo('should specify json in content type header');
    });
});
