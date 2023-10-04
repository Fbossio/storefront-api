import client from '../../config/database';
import { IOrderDetail, OrderStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';


const store = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

const restartTable = async () => {
  await client.query('TRUNCATE users CASCADE');
  await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
};

describe('User Model', () => {
    beforeEach(async () => {
        await restartTable();
    });
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).toEqual([])
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('method create should add a user', async () => {
        const result = await store.create({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
        })
        expect(result.id).toBe(1);
        expect(result.firstname).toBe('test');
        expect(result.lastname).toBe('test');
        expect(result.email).toBe('test@test.com')
        expect(result.password).not.toBe('test')        
        
    })
    it('should have a authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });
    it('method authenticate should return the correct user', async () => {
        const createdUser = await store.create({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
        })
        const result = await store.authenticate('test@test.com', 'test')
        expect(result?.id).toBe(createdUser.id);
        expect(result?.firstname).toBe('test');
        expect(result?.lastname).toBe('test');
        expect(result?.email).toBe('test@test.com');
        
    })
    it('method authenticate should return null if the user is not found', async () => {
        const result = await store.authenticate('test@test.com', 'test');
        expect(result).toBe(null);
    })

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    })
    it('method show should return the correct user', async () => {
        const createdUser = await store.create({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
        })
        const result = await store.show(createdUser.id!.toString());
        expect(result.id).toBe(createdUser.id);
        expect(result.firstname).toBe('test');
        expect(result.lastname).toBe('test');
        expect(result.lastPurchasedProducts).toBeDefined();
        expect(result.lastPurchasedProducts).toEqual([]);
    });
    it('method show should return the correct user with lastPurchasedProducts', async () => {
        const createdUser = await store.create({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
        })
        const createdProduct = await productStore.create({
            name: 'test',
            price: 10,
            category: 'test'
        });
        const createdOrder = await orderStore.create({
            user_id: createdUser.id!,
            status: 'active'
        });

        const orderDetailObj = {
            order_id: createdOrder.id,
            product_id: createdProduct.id,
            quantity: 1
        }

        await orderStore.addProduct(orderDetailObj as unknown as IOrderDetail);
        const result = await store.show(createdUser.id!.toString());
        expect(result.id).toBe(createdUser.id);
        expect(result.lastPurchasedProducts).toBeDefined();
        expect(result.lastPurchasedProducts).toEqual(['test']);
    });

    it('method show should throw an error if the user is not found', async () => {
        try {
            await store.show('1');
        } catch (error) {
            expect(error).toEqual(new Error(`Could not find user 1. Error: Query result is empty`))
        }
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('method delete should remove the user', async () => {
        const createdUser = await store.create({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
        })
        await store.delete(createdUser.id!.toString());
        const result = await store.index();
        expect(result).toEqual([]);
    });
    it('method delete should throw an error if the user is not found', async () => {
        try {
            await store.delete('1');
        } catch (error) {
            expect(error).toEqual(new Error(`Could not delete user 1. Error: Error: Query result is empty`))
        }
    });
    it('should have an update method', () => {
        expect(store.update).toBeDefined();
    });
    it('method update should update the user', async () => {
        const createdUser = await store.create({
            firstname: 'test',
            lastname: 'test',
            email: 'test@test.com',
            password: 'test'
    });
    const result = await store.update({
        id: 1,
        firstname: 'test2',
        lastname: 'test2'
    });
    expect(result.id).toBe(createdUser.id);
    expect(result.firstname).toBe('test2');
    expect(result.lastname).toBe('test2');
    });
})