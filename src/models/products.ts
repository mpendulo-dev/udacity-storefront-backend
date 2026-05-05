import Client from "../database";
import { Product } from "../types/products";

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM products";

      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get products ${err}`);
    }
  }
  async show(id: string): Promise<Product> {
    try {
      const sql = "SELECT * FROM products WHERE id=($1)";

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get product ${id}. Error: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql =
        "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *";

      const conn = await Client.connect();

      const result = await conn.query(sql, [product.name, product.price]);

      const products = result.rows[0];

      conn.release();

      return products;
    } catch (err) {
      throw new Error(`Could not add product ${product.name}. Error: ${err}`);
    }
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    try {
      const conn = await Client.connect();

      const sql = `
      UPDATE users 
      SET name = COALESCE($1, name),
          price = COALESCE($2, price)
      WHERE id = $3
      RETURNING *;
    `;

      const result = await conn.query(sql, [product.name, product.price, id]);

      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update product ${id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)";

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const p = result.rows[0];

      conn.release();

      return p;
    } catch (err) {
      throw new Error(`Could not delete product with id ${id}. Error: ${err}`);
    }
  }
}
