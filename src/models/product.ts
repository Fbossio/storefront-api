import client from '../config/database';

export interface IProduct {
  id?: number;
  name: string;
  price: number;
  category: string;
}

export interface IUpdateProduct {
  id: number;
  name?: string;
  price?: number;
  category?: string;
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

  async show(id: string): Promise<IProduct> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find product ${id}. Error: ${error}`);
    }
  }

  async create(p: IProduct): Promise<IProduct> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<IProduct> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (error) {
      throw new Error(`Could not delete product ${id}. Error: ${error}`);
    }
  }

  async update(p: IUpdateProduct): Promise<IProduct> {
    try {
      const conn = await client.connect();
      // Fields to update and their values
      const updates: string[] = [];
      const values: (string | number)[] = [];

      if (p.name !== undefined) {
        updates.push(`name = $${updates.length + 1}`);
        values.push(p.name);
      }

      if (p.price !== undefined) {
        updates.push(`price = $${updates.length + 1}`);
        values.push(p.price);
      }

      if (p.category !== undefined) {
        updates.push(`category = $${updates.length + 1}`);
        values.push(p.category);
      }

      // Add product id to values array
      values.push(p.id);

      // Generate SQL statement
      const sql = `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${values.length} RETURNING *
    `;

      // Execute SQL statement
      const result = await conn.query(sql, values);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (error) {
      throw new Error(`Could not update product ${p.id}. Error: ${error}`);
    }
  }
}
