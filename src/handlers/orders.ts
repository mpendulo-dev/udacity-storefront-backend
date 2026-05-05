import express, { Request, Response } from "express";
import { OrderStore } from "../models/orders";
import jwt from "jsonwebtoken";
import { Order } from "../types/orders";

const orderStore = new OrderStore();

const index = async (req: Request, res: Response) => {
  const orders = await orderStore.index();
  res.json(orders);
};

const show = async (req: any, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("Missing id parameter");
  }
  const _order = await orderStore.show(id);
  res.json(_order);
};

const create = async (req: Request, res: Response) => {
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
    const userOrder: Order = {
      status: req.body.status,
      user_id: req.body.user_id,
    };

    const newOrder = await orderStore.create(userOrder);
    res.json(newOrder);
  } catch (err) {
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
    const { status } = req.body;
    const updateOrder = await orderStore.update(id, {
      status,
    });

    res.json(updateOrder);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const deleteOrder = async (req: any, res: Response) => {
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
  await orderStore.delete(id);
  res.send(`Order with id ${id} deleted`);
};

const addProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    return res.status(400).send("Invalid ID");
  }
  const productId: string = req.body.productId;
  const quantity: number = req.body.quantity;
  try {
    const addedProduct = await orderStore.addProduct(quantity, id, productId);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get("/orders", index);
  app.get("/orders/:id", show);
  app.post("/orders", create);
  app.put("/orders/:id", update);
  app.delete("/orders/:id", deleteOrder);
  app.post("/orders/:id/products", addProduct);
};

export default orderRoutes;
