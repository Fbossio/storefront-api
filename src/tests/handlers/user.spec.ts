import request from 'supertest';
import client from '../../config/database';
import server from '../../server';

const restartTable = async () => {
    await client.query('TRUNCATE users CASCADE');
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
}

describe('User handler', () => {
    beforeEach(async () => {
        await restartTable();
    });
    it('should create a new user', async () => {
        const response = await request(server)
            .post('/signup')
            .send({
                firstname: 'test',
                lastname: 'test',
                email: 'test@test.com',
                password: 'test'
            });
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(String);
    })
    it('should return a token', async () => {
        const createdUser = await request(server)
            .post('/signup')
            .send({
                firstname: 'test',
                lastname: 'test',
                email: 'test@test.com',
                password: 'test'
            });
        const response = await request(server)
            .post('/signin')
            .send({
                email: 'test@test.com',
                password: 'test'
            });
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(String);
    });
    it('should throw an error if the user is not found', async () => {
        const response = await request(server)
            .post('/signin')
            .send({
                email: 'test@test.com',
                password: 'test'
            });
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({ error: 'Unauthorized' })
    });
});