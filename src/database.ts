import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const env = process.env.NODE_ENV || "dev";

const database =
  env === "test"
    ? process.env.POSTGRES_DB_NAME_TEST
    : process.env.POSTGRES_DB_NAME_DEV;

const client = new Pool({
  host: process.env.POSTGRES_HOST,
  database,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export default client;
