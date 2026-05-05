import express, { Request, Response } from "express";
import { UserStore } from "../models/users";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../types/users";

const userStore = new UserStore();

const index = async (req: Request, res: Response) => {
  const users = await userStore.index();
  res.json(users);
};

const show = async (req: any, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("Missing id parameter");
  }
  const user = await userStore.show(id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const _user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
    };

    const newUser = await userStore.create(_user);
    var token = jwt.sign({ user: newUser }, `${process.env.TOKEN_SECRET}`);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      throw new Error("Token missing");
    }

    const tokenSecret = process.env.TOKEN_SECRET as string;

    const decoded = jwt.verify(token, tokenSecret);

    console.log(decoded);
  } catch (err) {
    res.status(401);
    res.json("Access denied, invalid token");
    return;
  }

  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      return res.status(400).send("Missing required parameter :id.");
    }
    const { first_name, last_name, username } = req.body;
    const updatedUser = await userStore.update(id, {
      first_name,
      last_name,
      username,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = req.body.username as string;
    const password = req.body.password as string;
    if (!username || !password) {
      return res
        .status(400)
        .send("Some required parameters are missing! eg. :username, :password");
    }

    const user = await userStore.authenticate(username, password);
    if (!user) {
      return res.status(401).send(`Incorrect password for user ${username}.`);
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      `${process.env.TOKEN_SECRET}`,
    );

    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
};
const deleteUser = async (req: any, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      throw new Error("Token missing");
    }

    const tokenSecret = process.env.TOKEN_SECRET as string;

    const decoded = jwt.verify(token, tokenSecret);

    console.log(decoded);
  } catch (err) {
    res.status(401);
    res.json("Access denied, invalid token");
    return;
  }

  const id = req.params.id;

  if (!id) {
    return res.status(400).send("Missing id parameter");
  }
  await userStore.delete(id);
  res.send(`User with id ${id} deleted`);
};

const userRoutes = (app: express.Application) => {
  app.get("/users", index);
  app.get("/users/:id", show);
  app.post("/user", create);
  app.put("/users/:id", update);
  app.delete("/users/:id", deleteUser);
  app.post("/user/authenticate", authenticate);
};

export default userRoutes;
