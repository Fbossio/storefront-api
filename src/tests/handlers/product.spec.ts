import request from 'supertest';
import client from '../../config/database';
import server from '../../server';

const restartTable = async () => {
    await client.query('TRUNCATE products CASCADE');
    await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
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

describe('Product handler', () => {
    let token: string;
    beforeAll(async () => {
        token = await getToken();
    })

    beforeEach(async () => {
        await restartTable();
    });
    it('should return a list of products', async () => {
        const response = await request(server).get('/products');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });
    it('should create a new product', async () => {
        const response = await request(server)
            .post('/products')
            .set('Authorization', token)
            .send({
                name: 'test',
                price: 1,
                category: 'test'
            });
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('test');
        expect(parseInt(response.body.price)).toEqual(1);
        expect(response.body.category).toEqual('test');
    });    
    it('should return a product', async () => {
        const createdProduct = await request(server)
            .post('/products')
            .set('Authorization', token)
            .send({
                name: 'test',
                price: 1,
                category: 'test'
            });
        const response = await request(server).get(`/products/${createdProduct.body.id}`);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('test');
        expect(parseInt(response.body.price)).toEqual(1);
        expect(response.body.category).toEqual('test');
    });
    it('should throw an error if the product is not found', async () => {
        const response = await request(server).get('/products/1');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'Product not found' })
    });
    it('should delete a product', async () => {
        const createdProduct = await request(server)
            .post('/products')
            .set('Authorization', token)
            .send({
                name: 'test',
                price: 1,
                category: 'test'
            });
        const response = await request(server)
            .delete(`/products/${createdProduct.body.id}`)
            .set('Authorization', token);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('test');
        expect(parseInt(response.body.price)).toEqual(1);
        expect(response.body.category).toEqual('test');
    });
    it('should throw an error if the product is not found', async () => {
        const response = await request(server)
            .delete('/products/1')
            .set('Authorization', token);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'Product not deleted' })
    });
    it ('should update a product', async () => {
        const createdProduct = await request(server)
            .post('/products')
            .set('Authorization', token)
            .send({
                name: 'test',
                price: 1,
                category: 'test'
            });
        const response = await request(server)
            .put(`/products/${createdProduct.body.id}`)
            .set('Authorization', token)
            .send({                
                name: 'test2',
                price: 2,                
            });
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('test2');
        expect(parseInt(response.body.price)).toEqual(2);        
    });
    it('should throw an error if the product is not updated', async () => {
        const response = await request(server)
            .put('/products/1')
            .set('Authorization', token)
            .send({                
                name: 'test2',
                price: 2,                
            });
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'Product not updated' })
    });
    it('should return a list of top products', async () => {
        const response = await request(server).get('/top_products');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(0);
    });
})