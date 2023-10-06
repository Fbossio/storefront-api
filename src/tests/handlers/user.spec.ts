import request from 'supertest';
import client from '../../config/database';
import server from '../../server';

const restartTable = async () => {
    await client.query('TRUNCATE users CASCADE');
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
}
const getToken = async () => {
    const createdUser = await request(server)
        .post('/signup')
        .send({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
        })
    
    const response = await request(server)
        .post('/signin')
        .send({
            email: 'test@test.com',
            password: 'test'
        })

    return response.body;
}


describe('User handler', () => {
    let token: string;
    beforeAll(async () => {
        token = await getToken();
    })
    beforeEach(async () => {
        await restartTable();
    });
    it('should register a new user', async () => {
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
    it('should return a user', async () => { 
        const createdUser = await request(server)
            .post('/users')
            .set('Authorization', token)
            .send({
                firstname: 'test',
                lastname: 'test',
                email: 'test@test.com',
                password: 'test'
            });       
        const response = await request(server)
            .get(`/users/${createdUser.body.id}`)
            .set('Authorization', token)
            .send();
        expect(response.status).toEqual(200);
        });
    it('should create a new user', async () => {
        const response = await request(server)
            .post('/users')
            .set('Authorization', token)
            .send({
                firstname: 'test',
                lastname: 'test',
                email: 'test@test.com',
                password: 'test'
            });
        expect(response.status).toEqual(200);
        expect(response.body.firstname).toEqual('test');
        expect(response.body.lastname).toEqual('test');
    })
    it('should return a list of users', async () => {
        const response = await request(server)
            .get('/users')
            .set('Authorization', token)
            .send();
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
    });            
});