import request from 'supertest';
import client from '../../config/database';
import server from '../../server';

const restartTable = async () => {
    await client.query('TRUNCATE orders CASCADE');
    await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
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

describe ('Order handler', () => {
    let token: string;
    beforeAll(async () => {
        token = await getToken();
    })

    beforeEach(async () => {
        await restartTable();
    });

    it('should return a list of orders', async () => {
        const response = await request(server)
            .get('/orders')
            .set('Authorization', token)
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });
    it('should return a order', async () => {
        const createdOrder = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        const response = await request(server)
            .get(`/orders/${createdOrder.body.id}`)
            .set('Authorization', token)
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('active');
    });
    it('should throw an error if order is not found', async () => {
        const response = await request(server)
            .get('/orders/1')
            .set('Authorization', token)
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('Order not found');
    });

    it('should create a new order', async () => {
        const response = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('active');
    });
    it('should delete an order', async () => {
        const createdOrder = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        const response = await request(server)
            .delete(`/orders/${createdOrder.body.id}`)
            .set('Authorization', token)
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('active');
    });
    it('should throw an error if order is not deleted', async () => {
        const response = await request(server)
            .delete('/orders/1')
            .set('Authorization', token)
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('Order not deleted');
    });
    it('should update an order', async () => {
        const createdOrder = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        const response = await request(server)
            .put(`/orders/${createdOrder.body.id}`)
            .set('Authorization', token)
            .send({                
                status: 'completed',
            });
        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('completed');
    });
});