import client from '../config/database';

export interface IProduct {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

export class ProductStore {
  async index(): Promise<IProduct[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }
}
