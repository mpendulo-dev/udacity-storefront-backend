import supertest from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import orderRoutes from "../../handlers/orders";
import userRoutes from "../../handlers/users";
import { OrderStore } from "../../models/orders";
import { UserStore } from "../../models/users";
import { ProductStore } from "../../models/products";

const app = express();
app.use(express.json());
orderRoutes(app);
userRoutes(app);

const request = supertest(app);
const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Orders Handler", () => {
  let orderId: string;
  let userId: string;
  let productId: string;
  let token: string;

  const testUser = {
    first_name: "John",
    last_name: "Doe",
    username: `johndoe_order_handler_${Date.now()}`,
    password: "password123",
  };

  const testProduct = {
    name: "Test Product",
    price: 9.99,
  };

  beforeAll(async () => {
    try {
      const userRes = await request.post("/user").send(testUser);
      token = userRes.body;
      const decoded = jwt.decode(token) as { user: { id: string } };
      userId = decoded.user.id;

      const product = await productStore.create(testProduct);
      productId = String(product.id);
    } catch (err) {
      console.error("beforeAll failed:", err);
      throw err;
    }
  });

  afterAll(async () => {
    try {
      const orders = await orderStore.index();
      for (const order of orders) {
        await orderStore.delete(String(order.id));
      }
      await productStore.delete(productId);
      await userStore.delete(userId);
    } catch (err) {
      console.error("afterAll failed:", err);
    }
  });

  it("should return a list of orders", async () => {
    const res = await request.get("/orders");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it("should return 401 when creating an order without a token", async () => {
    const res = await request.post("/orders").send({
      status: "active",
      user_id: userId,
    });

    expect(res.status).toBe(401);
  });

  it("should create an order with a valid token", async () => {
    const res = await request
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "active", user_id: userId });

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("active");

    orderId = res.body.id;
  });

  it("should return the correct order by id", async () => {
    const res = await request.get(`/orders/${orderId}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("active");
  });

  it("should return 401 when updating an order without a token", async () => {
    const res = await request
      .put(`/orders/${orderId}`)
      .send({ status: "complete" });

    expect(res.status).toBe(401);
  });

  it("should update an order with a valid token", async () => {
    const res = await request
      .put(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "complete" });

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("complete");
  });

  it("should add a product to an order", async () => {
    const res = await request
      .post(`/orders/${orderId}/products`)
      .send({ productId, quantity: 2 });

    expect(res.status).toBe(200);
    expect(Number(res.body.quantity)).toEqual(2);
  });

  it("should return 401 when deleting an order without a token", async () => {
    const res = await request.delete(`/orders/${orderId}`);

    expect(res.status).toBe(401);
  });

  it("should delete an order with a valid token", async () => {
    const res = await request
      .delete(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.text).toContain(`Order with id ${orderId} deleted`);

    orderId = "";
  });
});
