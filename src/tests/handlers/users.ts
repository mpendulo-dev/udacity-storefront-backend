import supertest from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import userRoutes from "../../handlers/users";
import { UserStore } from "../../models/users";

const app = express();
app.use(express.json());
userRoutes(app);

const request = supertest(app);
const userStore = new UserStore();

describe("Users Handler", () => {
  let userId: string;
  let token: string;

  const testUser = {
    first_name: "John",
    last_name: "Doe",
    username: `johndoe_handler_${Date.now()}`,
    password: "password123",
  };

  beforeAll(async () => {
    try {
      const res = await request.post("/user").send(testUser);
      token = res.body;
      const decoded = jwt.decode(token) as { user: { id: string } };
      userId = decoded.user.id;
    } catch (err) {
      console.error("beforeAll failed:", err);
      throw err;
    }
  });

  afterAll(async () => {
    try {
      await userStore.delete(String(userId));
    } catch (err) {
      console.error("afterAll failed:", err);
    }
  });

  it("should create a user and return a token", async () => {
    const newUser = {
      first_name: "Jane",
      last_name: "Smith",
      username: `janesmith_${Date.now()}`,
      password: "password123",
    };

    const res = await request.post("/user").send(newUser);

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();

    const decoded = jwt.decode(res.body) as { user: { id: string } };
    await userStore.delete(String(decoded.user.id));
  });

  it("should return a list of users", async () => {
    const res = await request.get("/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it("should return the correct user by id", async () => {
    const res = await request.get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(testUser.username);
  });

  it("should return 400 when id is missing on show", async () => {
    const res = await request.get("/users/");

    expect(res.status).toBe(400);
  });

  it("should authenticate a user and return a token", async () => {
    const res = await request.post("/user/authenticate").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });

  it("should return 401 for incorrect password", async () => {
    const res = await request.post("/user/authenticate").send({
      username: testUser.username,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("should return 400 when credentials are missing on authenticate", async () => {
    const res = await request.post("/user/authenticate").send({});

    expect(res.status).toBe(400);
  });

  it("should update a user with a valid token", async () => {
    const res = await request
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ first_name: "Updated", last_name: "Name" });

    expect(res.status).toBe(200);
    expect(res.body.first_name).toEqual("Updated");
    expect(res.body.last_name).toEqual("Name");
  });

  it("should return 401 when updating without a token", async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ first_name: "Updated" });

    expect(res.status).toBe(401);
  });

  it("should delete a user with a valid token", async () => {
    const newUser = {
      first_name: "To",
      last_name: "Delete",
      username: `todelete_${Date.now()}`,
      password: "password123",
    };

    const createRes = await request.post("/user").send(newUser);
    const decoded = jwt.decode(createRes.body) as { user: { id: string } };
    const newUserId = decoded.user.id;

    const res = await request
      .delete(`/users/${newUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.text).toContain(`User with id ${newUserId} deleted`);
  });

  it("should return 401 when deleting without a token", async () => {
    const res = await request.delete(`/users/${userId}`);

    expect(res.status).toBe(401);
  });
});
