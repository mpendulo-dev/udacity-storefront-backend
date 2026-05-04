import express from "express";
const port = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
