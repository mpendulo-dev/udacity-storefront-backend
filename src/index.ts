import express from "express";
import userRoutes from "./handlers/users";
import productRoutes from "./handlers/products";
const port = process.env.PORT;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server");
});

userRoutes(app);
productRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
