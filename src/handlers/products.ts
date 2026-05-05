import express, { Request, Response } from "express";
import { ProductStore } from "../models/products";
import { Product } from "../types/products";
import jwt from "jsonwebtoken";

const productStore = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await productStore.index();
  res.json(products);
};

const show = async (req: any, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("Missing id parameter");
  }
  const product = await productStore.show(id);
  res.json(product);
};
const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
    };

    const newProduct = await productStore.create(product);
    res.json(newProduct);
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
    const { name, price } = req.body;
    const updatedProduct = await productStore.update(id, {
      name,
      price,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const deleteProduct = async (req: any, res: Response) => {
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
  await productStore.delete(id);
  res.send(`Product with id ${id} deleted`);
};

const productRoutes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/product", create);
  app.put("/products/:id", update);
  app.delete("/products/:id", deleteProduct);
};

export default productRoutes;
