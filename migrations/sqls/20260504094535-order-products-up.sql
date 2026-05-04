CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  quantity INTEGER,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
);