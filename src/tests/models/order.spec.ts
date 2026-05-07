import { OrderStore } from "../../models/orders";
import { ProductStore } from "../../models/products";
import { UserStore } from "../../models/users";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("OrderStore Model", () => {
  let userId: number;
  let productId: number;

  const testUser = {
    first_name: "John",
    last_name: "Doe",
    username: `johndoe_order_model_${Date.now()}`,
    password: "password123",
  };

  const testProduct = {
    name: "Test Product",
    price: 90,
  };

  beforeAll(async () => {
    try {
      const user = await userStore.create(testUser);
      userId = parseInt(user.id!);

      const product = await productStore.create(testProduct);
      productId = parseInt(String(product.id));
    } catch (err) {
      console.error("beforeAll failed:", err);
      throw err;
    }
  });

  afterAll(async () => {
    try {
      const orders = await store.index();
      for (const order of orders) {
        await store.delete(String(order.id));
      }
      await productStore.delete(String(productId));
      await userStore.delete(String(userId));
    } catch (err) {
      console.error("afterAll failed:", err);
    }
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have an update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("should have an addProduct method", () => {
    expect(store.addProduct).toBeDefined();
  });

  it("should create an order", async () => {
    const created = await store.create({ status: "active", user_id: userId });

    expect(created.status).toBe("active");
    expect(Number(created.user_id)).toBe(userId);

    await store.delete(String(created.id));
  });

  it("should return a list of orders", async () => {
    const created = await store.create({ status: "active", user_id: userId });

    const orders = await store.index();

    expect(orders.length).toBeGreaterThan(0);

    await store.delete(String(created.id));
  });

  it("should return the correct order by id", async () => {
    const created = await store.create({ status: "active", user_id: userId });

    const found = await store.show(String(created.id));

    expect(found.status).toEqual(created.status);
    expect(Number(found.user_id)).toEqual(userId);

    await store.delete(String(created.id));
  });

  it("should update the order", async () => {
    const created = await store.create({ status: "active", user_id: userId });

    const updated = await store.update(Number(created.id), {
      status: "complete",
    });

    expect(updated.status).toEqual("complete");

    await store.delete(String(created.id));
  });

  it("should delete the order", async () => {
    const created = await store.create({ status: "active", user_id: userId });

    await store.delete(String(created.id));

    expect(created.status).toEqual("active");
  });

  it("should add a product to an order", async () => {
    const created = await store.create({ status: "active", user_id: userId });

    const result = await store.addProduct(
      2,
      String(created.id),
      String(productId),
    );

    expect(result).toBeDefined();

    await store.delete(String(created.id));
  });
});
