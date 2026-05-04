import Client from "../database";
import bcrypt from "bcrypt";

export type User = {
  id?: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);

      conn.release();
      return await result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get user ${id}. Error: ${err}`);
    }
  }
  async create(user: User): Promise<User> {
    const pepper = process.env.BCRYPT_PASSWORD;
    const saltRounds = process.env.SALT_ROUNDS ?? "";
    try {
      const sql =
        "INSERT INTO users (first_name, last_name, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *";

      const conn = await Client.connect();

      const hash = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds, 10),
      );

      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        user.username,
        hash,
      ]);

      const users = result.rows[0];

      conn.release();

      return users;
    } catch (err) {
      throw new Error(`Could not add user ${user.username}. Error: ${err}`);
    }
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const pepper = process.env.BCRYPT_PASSWORD;
    const saltRounds = Number(process.env.SALT_ROUNDS);

    try {
      const conn = await Client.connect();

      let hash: string | undefined;

      if (user.password) {
        hash = bcrypt.hashSync(user.password + pepper, saltRounds);
      }

      const sql = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          username = COALESCE($3, username),
          password_digest = COALESCE($4, password_digest)
      WHERE id = $5
      RETURNING *;
    `;

      const result = await conn.query(sql, [
        user.first_name ?? null,
        user.last_name ?? null,
        user.username ?? null,
        hash ?? null,
        id,
      ]);

      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`User with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update user ${id}. Error: ${err}`);
    }
  }
  async authenticate(username: string, password: string): Promise<User | null> {
    const pepper = process.env.BCRYPT_PASSWORD;
    const conn = await Client.connect();
    const sql = "SELECT password_digest FROM users WHERE username=($1)";

    const results = await conn.query(sql, [username]);
    console.log(password + pepper);

    if (results.rows.length) {
      const user = results.rows[0];

      console.log(user);

      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user;
      }
    }
    return null;
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)";
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const article = result.rows[0];

      conn.release();

      return article;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
