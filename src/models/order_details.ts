import client from '../config/database';

export interface IOrderDetail {
  id?: number;
  quantity: number;
  order_id: number;
  product_id: number;
}

export class OrderDetailStore {
  async create(o: IOrderDetail): Promise<IOrderDetail> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO order_details (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [
        o.quantity,
        o.order_id,
        o.product_id,
      ]);
      const orderDetail = result.rows[0];
      conn.release();
      return orderDetail;
    } catch (error) {
      throw new Error(
        `Could not add new order detail ${o.quantity}. Error: ${error}`,
      );
    }
  }

  async index(): Promise<IOrderDetail[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM order_details';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get order details. Error: ${error}`);
    }
  }

  async show(id: string): Promise<IOrderDetail> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM order_details WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find order detail ${id}. Error: ${error}`);
    }
  }

  async delete(id: string): Promise<IOrderDetail> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM order_details WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      const orderDetail = result.rows[0];
      conn.release();
      return orderDetail;
    } catch (error) {
      throw new Error(`Could not delete order detail ${id}. Error: ${error}`);
    }
  }

  async deleteAll(): Promise<IOrderDetail[]> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM order_details RETURNING *';
      const result = await conn.query(sql);
      const orderDetails = result.rows;
      conn.release();
      return orderDetails;
    } catch (error) {
      throw new Error(`Could not delete order details. Error: ${error}`);
    }
  }
}
