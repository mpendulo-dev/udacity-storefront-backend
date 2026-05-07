import Client from "../database";
import { Order } from "../types/orders";

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);

      conn.release();

      return await result.rows;
    } catch (err) {
      throw new Error(`Could not get orders ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)";

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get order ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *";

      const conn = await Client.connect();

      const result = await conn.query(sql, [order.status, order.user_id]);

      const orders = result.rows[0];

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not add article ${order.id}. Error: ${err}`);
    }
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    try {
      const conn = await Client.connect();

      const sql = `
      UPDATE orders 
      SET status = COALESCE($1, status)
      WHERE id = $2
      RETURNING *;
    `;

      const result = await conn.query(sql, [order.status, id]);

      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`Order with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update order ${id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)";

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete order with id ${id}. Error: ${err}`);
    }
  }

  async addProduct(
    quantity: number,
    orderId: string,
    productId: string,
  ): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1,$2, $3) RETURNING *";

      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`,
      );
    }
  }
}
