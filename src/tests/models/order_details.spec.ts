import client from "../../config/database";
import { OrderDetailStore } from "../../models/order_details";

const store = new OrderDetailStore();
const restartTable = async () => {
    await client.query("TRUNCATE order_details CASCADE");
    await client.query("ALTER SEQUENCE order_details_id_seq RESTART WITH 1");
}

describe('OrderDetail Model', () => {
    beforeEach(async () => {
        await restartTable();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('method create should add an order detail', async () => {
        const result = await store.create({
            quantity: 1,
            order_id: 1,
            product_id: 1
        });
        expect(result.id).toBe(1);
        expect(result.quantity).toBe(1);
        expect(result.order_id).toBe(1);
        expect(result.product_id).toBe(1);
    });
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('method index should return a list of order details', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('method show should return the correct order detail', async () => {
        const createdOrderDetail = await store.create({
            quantity: 1,
            order_id: 1,
            product_id: 1
        });
        const result = await store.show('1');
        expect(result.id).toBe(createdOrderDetail.id);
        expect(result.quantity).toBe(1);
        expect(result.order_id).toBe(1);
        expect(result.product_id).toBe(1);
    });
    it('method show should throw an error if the order detail is not found', async () => {
        try {
            await store.show('1');
        } catch (error) {
            expect(error).toEqual(new Error(`Could not find order detail 1. Error: Error: Query result is empty`));
        }
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('method delete should remove the order detail', async () => {
        const createdOrderDetail = await store.create({
            quantity: 1,
            order_id: 1,
            product_id: 1
        });
        const result = await store.delete('1');
        expect(result.id).toBe(createdOrderDetail.id);
        expect(result.quantity).toBe(1);
        expect(result.order_id).toBe(1);
        expect(result.product_id).toBe(1);
    });
    it('method delete should throw an error if the order detail is not found', async () => {
        try {
            await store.delete('1');
        } catch (error) {
            expect(error).toEqual(new Error(`Could not delete order detail 1. Error: Error: Query result is empty`));
        }
    });
});