import request from 'supertest';
import app from '../src/server';

describe('Public Key API', () => {
    it('GET /api/key/:id --> specific public key by ID', () => {
        return request(app)
            .get('/api/key/aevanid')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({ public_key: 'aevankey' });
            });
    });
});
