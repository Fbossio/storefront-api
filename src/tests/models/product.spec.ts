import client from '../../config/database';
import { ProductStore } from '../../models/product';

const store = new ProductStore();

const restartTable = async () => {
  await client.query('TRUNCATE products CASCADE');
  await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
};

describe('Product Model', () => {
  beforeEach(async () => {
    await restartTable();
  });
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have an update method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });
  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });
  it('method create should add a product', async () => {
    const result = await store.create({
      name: 'test',
      price: 100,
      category: 'sports',
    });
    expect(result.id).toBe(1);
    expect(result.name).toBe('test');
    expect(parseInt(result.price as unknown as string)).toBe(100);
    expect(result.category).toBe('sports');
    
  });
  it('method show should return the correct product', async () => {
    await store.create({
      name: 'test',
      price: 100,
      category: 'sports',
    });
    const result = await store.show('1');
    expect(result.id).toBe(1);
    expect(result.name).toBe('test');
    expect(parseInt(result.price as unknown as string)).toBe(100);
    expect(result.category).toBe('sports');
    
  });
  it('method delete should remove the product', async () => {
    await store.create({
      name: 'test',
      price: 100,
      category: 'sports',
    });
    await store.delete('1');
    const result = await store.index();
    expect(result).toEqual([]);
    
  });
  it('method update should update the product', async () => {
    await store.create({
      name: 'test',
      price: 100,
      category: 'sports',
    });
    const result = await store.update({
      id: 1,
      name: 'test2',
      price: 200,
      category: 'sports',
    });
    expect(result.id).toBe(1);
    expect(result.name).toBe('test2');
    expect(parseInt(result.price as unknown as string)).toBe(200);
    expect(result.category).toBe('sports');
    
  });
  it('method show should throw an error if the product does not exist', async () => {
    try {
      await store.show('1');
    } catch (error) {
      expect(error).toEqual(
        new Error('Could not find product 1. Error: Error: Product not found'),
      );
    }
  });
  it('method delete should throw an error if the product does not exist', async () => {
    try {
      await store.delete('1');
    } catch (error) {
      expect(error).toEqual(
        new Error(
          'Could not delete product 1. Error: Error: Product not found',
        ),
      );
    }
  });
  it('method update should throw an error if the product does not exist', async () => {
    try {
      await store.update({
        id: 1,
        name: 'test2',
        price: 200,
        category: 'sports',
      });
    } catch (error) {
      expect(error).toEqual(
        new Error(
          'Could not update product 1. Error: Error: Product not found',
        ),
      );
    }
  });
  it('should have a topProducts method', () => {
    expect(store.topProducts).toBeDefined();
  });
  it('topProducts method should return a list of products', async () => {
    const result = await store.topProducts();
    expect(result).toEqual([]);
  });
});
