import supertest from "supertest";
import express from "express";
import productRoutes from "../../handlers/products";
import userRoutes from "../../handlers/users";
import { ProductStore } from "../../models/products";

const app = express();
app.use(express.json());
productRoutes(app);
userRoutes(app);

const request = supertest(app);
const productStore = new ProductStore();

describe("Products Handler", () => {
  let productId: string;
  let token: string;

  const testUser = {
    first_name: "John",
    last_name: "Doe",
    username: `johndoe_product_handler_${Date.now()}`,
    password: "password123",
  };

  const testProduct = {
    name: "Test Product",
    price: 9,
  };

  beforeAll(async () => {
    try {
      const res = await request.post("/user").send(testUser);
      token = res.body;
    } catch (err) {
      console.error("beforeAll failed:", err);
      throw err;
    }
  });

  afterAll(async () => {
    try {
      if (productId) {
        await productStore.delete(productId);
      }
    } catch (err) {
      console.error("afterAll failed:", err);
    }
  });

  it("should return a list of products", async () => {
    const res = await request.get("/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it("should return 401 when creating a product without a token", async () => {
    const res = await request.post("/product").send(testProduct);

    expect(res.status).toBe(401);
  });

  it("should create a product with a valid token", async () => {
    const res = await request
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(testProduct.name);
    expect(Number(res.body.price)).toEqual(testProduct.price);

    productId = res.body.id;
  });

  it("should return the correct product by id", async () => {
    const res = await request.get(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(testProduct.name);
  });

  it("should return 401 when updating a product without a token", async () => {
    const res = await request
      .put(`/products/${productId}`)
      .send({ name: "Updated Product", price: 19.99 });

    expect(res.status).toBe(401);
  });

  it("should update a product with a valid token", async () => {
    const res = await request
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Product", price: 19.99 });

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual("Updated Product");
    expect(Number(res.body.price)).toEqual(19.99);
  });

  it("should return 401 when deleting a product without a token", async () => {
    const res = await request.delete(`/products/${productId}`);

    expect(res.status).toBe(401);
  });

  it("should delete a product with a valid token", async () => {
    const res = await request
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.text).toContain(`Product with id ${productId} deleted`);

    productId = "";
  });
});
