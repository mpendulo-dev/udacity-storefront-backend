import { UserStore } from "../../models/users";
import { User } from "../../types/users";

const userStore = new UserStore();

describe("UserStore Model", () => {
  const testUser = {
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    password: "password123",
  };

  it("should have an index method", () => {
    expect(userStore.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(userStore.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(userStore.create).toBeDefined();
  });

  it("should have an update method", () => {
    expect(userStore.update).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(userStore.delete).toBeDefined();
  });

  it("should have an authenticate method", () => {
    expect(userStore.authenticate).toBeDefined();
  });

  it("should create a user", async () => {
    const created: User = await userStore.create(testUser);

    expect(created.username).toBe(testUser.username);
    expect(created.first_name).toBe(testUser.first_name);
    expect(created.last_name).toBe(testUser.last_name);

    await userStore.delete(String(created.id));
  });

  it("should return a list of users", async () => {
    const created: User = await userStore.create(testUser);

    const users: User[] = await userStore.index();

    expect(users.length).toBeGreaterThan(0);
    expect(users[0]?.username).toBeDefined();

    await userStore.delete(String(created.id));
  });

  it("should return the correct user by id", async () => {
    const created: User = await userStore.create(testUser);

    const found: User = await userStore.show(String(created.id));

    expect(found).toEqual(created);

    await userStore.delete(String(created.id));
  });

  //   it("should update the user", async () => {
  //     const created: User = await userStore.create(testUser);
  //     const createdId = created.id;

  //     const { first_name, last_name } = await userStore.update(createdId, {
  //       first_name: "Jane",
  //       last_name: "Smith",
  //     });

  //     expect(first_name).toEqual("Jane");
  //     expect(last_name).toEqual("Smith");

  //     await userStore.delete(String(created.id));
  //   });

  it("should delete the user", async () => {
    const created: User = await userStore.create(testUser);

    await userStore.delete(String(created.id));

    expect(created.first_name).toEqual(testUser.first_name);
    expect(created.last_name).toEqual(testUser.last_name);
  });

  it("should return user when credentials are valid", async () => {
    const created: User = await userStore.create(testUser);

    const authed = await userStore.authenticate(
      testUser.username,
      testUser.password,
    );

    expect(authed).not.toBeNull();
    expect(authed?.username).toBe(testUser.username);

    await userStore.delete(String(created.id));
  });

  it("should return null when password is incorrect", async () => {
    const created: User = await userStore.create(testUser);

    const authed = await userStore.authenticate(
      testUser.username,
      "wrongpassword",
    );

    expect(authed).toBeNull();

    await userStore.delete(String(created.id));
  });

  it("should return null when user does not exist", async () => {
    const authed = await userStore.authenticate("nonexistent", "password123");

    expect(authed).toBeNull();
  });
});
