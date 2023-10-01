import client from '../config/database';

export interface IOrder {
  id?: number;
  status: string;
  user_id: number;
}

export interface IUpdateOrder {
  id: number;
  status: string;
}

export class OrderStore {
  async create(o: IOrder): Promise<IOrder> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.status, o.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Could not add new order ${o.status}. Error: ${error}`);
    }
  }

  async index(): Promise<IOrder[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  async show(id: string): Promise<IOrder> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find order ${id}. Error: ${error}`);
    }
  }

  async delete(id: string): Promise<IOrder> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Could not delete order ${id}. Error: ${error}`);
    }
  }

  async update(o: IUpdateOrder): Promise<IOrder> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE orders SET status=($1) WHERE id=($2) RETURNING *';
      const result = await conn.query(sql, [o.status, o.id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Could not update order ${o.id}. Error: ${error}`);
    }
  }
}
