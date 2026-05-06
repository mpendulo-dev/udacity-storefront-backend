import { ProductStore } from "../../models/products";
import { Product } from "../../types/products";

const store = new ProductStore();

describe("ProductStore Model", () => {
  const testProduct: Product = {
    name: "Test Product",
    price: 9,
  };

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

  it("should create a product", async () => {
    const created: Product = await store.create(testProduct);

    expect(created.name).toBe(testProduct.name);
    expect(created.price).toBe(testProduct.price);

    await store.delete(String(created.id));
  });

  it("should return a list of products", async () => {
    const created: Product = await store.create(testProduct);

    const products: Product[] = await store.index();

    expect(products.length).toBeGreaterThan(0);
    expect(products[0]?.name).toBeDefined();

    await store.delete(String(created.id));
  });

  it("should return the correct product by id", async () => {
    const created: Product = await store.create(testProduct);

    const found: Product = await store.show(String(created.id));

    expect(found.name).toEqual(created.name);
    expect(found.price).toEqual(created.price);

    await store.delete(String(created.id));
  });

  it("should update the product", async () => {
    const created: Product = await store.create(testProduct);

    const { name, price } = await store.update(Number(created.id), {
      name: "Updated Product",
      price: 19,
    });

    expect(name).toEqual("Updated Product");
    expect(price).toEqual(19);

    await store.delete(String(created.id));
  });

  it("should delete the product", async () => {
    const created: Product = await store.create(testProduct);

    await store.delete(String(created.id));

    expect(created.name).toEqual(testProduct.name);
    expect(created.price).toEqual(testProduct.price);
  });
});
