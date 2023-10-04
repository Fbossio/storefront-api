import bcrypt from 'bcrypt';
import client from '../config/database';

export interface IUser {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  lastPurchasedProducts?: string[];
}

export interface IUpdateUser {
  id: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  lastPurchasedProducts?: string[];
}

export class UserStore {
  private readonly pepper: string = process.env.BCRYPT_PASSWORD!;

  private readonly saltRounds: string = process.env.SALT_ROUNDS!;

  async index(): Promise<IUser[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get users. Error: ${error}`);
    }
  }

  async create(u: IUser): Promise<IUser> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(
        u.password + this.pepper,
        parseInt(this.saltRounds),
      );
      const result = await conn.query(sql, [
        u.firstname,
        u.lastname,
        u.email,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Could not add new user ${u.email}. Error: ${error}`);
    }
  }

  async authenticate(email: string, password: string): Promise<IUser | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE email=($1)';
      const result = await conn.query(sql, [email]);
      const user = result.rows[0];
      if (!user) {
        return null;
      }
      if (bcrypt.compareSync(password + this.pepper, user.password)) {
        return user;
      }
      return null;
    } catch (error) {
      throw new Error(`Could not authenticate user ${email}. Error: ${error}`);
    }
  }

  async show(id: string): Promise<IUser> {
    try {
      const conn = await client.connect();
      const userSql = 'SELECT * FROM users WHERE id=($1)';
      const userResult = await conn.query(userSql, [id]);
      if (userResult.rows.length === 0) {
        throw new Error(
          `Could not find user ${id}. Error: Query result is empty`,
        );
      }
      const user = userResult.rows[0];

      const productsSql = `
      SELECT p.name
      FROM products p
      JOIN order_details od ON p.id = od.product_id
      JOIN orders o ON od.order_id = o.id
      WHERE o.user_id = $1
      ORDER BY o.id DESC
      LIMIT 5;
    `;
      const productsResult = await conn.query(productsSql, [id]);

      const products = productsResult.rows.map((row) => row.name);

      user.lastPurchasedProducts = products;
      conn.release();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<IUser> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Could not delete user ${id}. Error: ${error}`);
    }
  }

  async update(u: IUpdateUser): Promise<IUser> {
    try {
      const conn = await client.connect();

      const updates: string[] = [];
      const values: (string | number)[] = [];

      if (u.firstname !== undefined) {
        updates.push(`firstname = $${updates.length + 1}`);
        values.push(u.firstname);
      }

      if (u.lastname !== undefined) {
        updates.push(`lastname = $${updates.length + 1}`);
        values.push(u.lastname);
      }

      if (u.email !== undefined) {
        updates.push(`email = $${updates.length + 1}`);
        values.push(u.email);
      }

      if (u.password !== undefined) {
        updates.push(`password = $${updates.length + 1}`);
        values.push(
          bcrypt.hashSync(u.password + this.pepper, parseInt(this.saltRounds)),
        );
      }

      // Add user id to values array
      values.push(u.id);

      // Generate SQL statement
      const sql = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${values.length} RETURNING *`;

      // Execute SQL statement
      const result = await conn.query(sql, values);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Could not update user ${u.id}. Error: ${error}`);
    }
  }
}
