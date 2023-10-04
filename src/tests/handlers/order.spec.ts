import request from 'supertest';
import client from '../../config/database';
import server from '../../server';

const restartTable = async () => {
    await client.query('TRUNCATE orders CASCADE');
    await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
}

const restartTableOrderDetails = async () => {
    await client.query("TRUNCATE order_details CASCADE");
    await client.query("ALTER SEQUENCE order_details_id_seq RESTART WITH 1");
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
        await restartTableOrderDetails();
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
    it('should add a product to an order', async () => {
        const createdOrder = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        const response = await request(server)
            .post(`/orders/${createdOrder.body.id}/products`)
            .set('Authorization', token)
            .send({
                productId: 1,
                quantity: 1,
            });
        expect(response.status).toEqual(200);
        expect(response.body.quantity).toEqual(1);
    });
    it('should show a product from an order', async () => {
        const createdOrder = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        await request(server)
            .post(`/orders/${createdOrder.body.id}/products`)
            .set('Authorization', token)
            .send({
                productId: 1,
                quantity: 1,
            });
        const response = await request(server)
            .get(`/orders/${createdOrder.body.id}/products`)
            .set('Authorization', token)        
        expect(response.status).toEqual(200);
        expect(response.body.order_id).toEqual(createdOrder.body.id);
        expect(response.body.quantity).toEqual(1);
        expect(response.body.product_id).toEqual(1);
    });
    it('should throw an error if product is not found in an order', async () => {        
        const response = await request(server)
            .get('/orders/1/products')
            .set('Authorization', token)        
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('Order not found');
    });
    it('should delete a product from an order', async () => {
        const createdOrder = await request(server)
            .post('/orders')
            .set('Authorization', token)
            .send({
                status: 'active',
            });
        await request(server)
            .post(`/orders/${createdOrder.body.id}/products`)
            .set('Authorization', token)
            .send({
                productId: 1,
                quantity: 1,
            });
        const response = await request(server)
            .delete(`/orders/${createdOrder.body.id}/products`)
            .set('Authorization', token)        
        expect(response.status).toEqual(200);
        expect(response.body.order_id).toEqual(createdOrder.body.id);
        expect(response.body.quantity).toEqual(1);
        expect(response.body.product_id).toEqual(1);
    });
    it('should throw an error if product is not deleted from an order', async () => {        
        const response = await request(server)
            .delete('/orders/1/products')
            .set('Authorization', token)        
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('Product not deleted from order');
    });
});