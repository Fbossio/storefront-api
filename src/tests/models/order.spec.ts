import client from "../../config/database";
import { OrderStore } from "../../models/order";

const store = new OrderStore();
const restartTable = async () => {
    await client.query("TRUNCATE orders CASCADE");
    await client.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1");
}

describe('Order Model', () => {
    beforeEach(async () => {
        await restartTable();
    })
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    })
    it('method create should add an order', async () => {
        const result = await store.create({
            status: 'active',
            user_id: 1
        })
        expect(result.id).toBe(1);
        expect(result.status).toBe('active');
        expect(result.user_id).toBe(1);
    });
    it('should have an index method', async () => {
        expect(store.index).toBeDefined();
    })
    it('method index should return a list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    })
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    })
    it('method show should return the correct order', async () => {
        const createdOrder = await store.create({
            status: 'active',
            user_id: 1
        })
        const result = await store.show('1');
        expect(result.id).toBe(createdOrder.id);
        expect(result.status).toBe('active');
        expect(result.user_id).toBe(1);
    });
    it('method show should throw an error if the order is not found', async () => {
        try {
            await store.show('1');
        } catch (error) {
            expect(error).toEqual(new Error(`Could not find order 1. Error: Error: Query result is empty`))
        }
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('method delete should remove the order', async () => {
        const createdOrder = await store.create({
            status: 'active',
            user_id: 1
        })
        const result = await store.delete('1');
        expect(result.id).toBe(createdOrder.id);
        expect(result.status).toBe('active');
        expect(result.user_id).toBe(1);
    });
    it('method delete should throw an error if the order is not found', async () => {
        try {
            await store.delete('1');
        } catch (error) {
            expect(error).toEqual(new Error(`Could not delete order 1. Error: Error: Query result is empty`))
        }
    });
    it('should have a update method', () => {
        expect(store.update).toBeDefined();
    });
    it('method update should update the order', async () => {
        const createdOrder = await store.create({
            status: 'active',
            user_id: 1
        })
        const result = await store.update({
            id: 1,
            status: 'complete'
        });
        expect(result.id).toBe(createdOrder.id);
        expect(result.status).toBe('complete');
        expect(result.user_id).toBe(1);
    })
    it('method update should throw an error if the order is not found', async () => {
        try {
            await store.update({
                id: 1,
                status: 'complete'
            });
        } catch (error) {
            expect(error).toEqual(new Error(`Could not update order 1. Error: Error: Query result is empty`))
        }
    });
})
