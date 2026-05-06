import { OrderStore } from "../../models/orders";
import { UserStore } from "../../models/users";
import { ProductStore } from "../../models/products";
import { Order } from "../../types/orders";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("OrderStore Model", () => {
  let userId: number;
  let productId: number;

  const testUser = {
    first_name: "John",
    last_name: "Doe",
    username: `johndoe_order_${Date.now()}`,
    password: "password123",
  };

  const testProduct = {
    name: "Test Product",
    price: 9,
  };

  beforeAll(async () => {
    try {
      const user = await userStore.create(testUser);
      userId = parseInt(user.id!);

      const product = await productStore.create(testProduct);
      productId = parseInt(product.id!);
    } catch (err) {
      console.error("beforeAll failed:", err);
      throw err;
    }
  });

  //   afterAll(async () => {
  //     await userStore.delete(String(userId));
  //     await productStore.delete(String(productId));
  //   });

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
});
