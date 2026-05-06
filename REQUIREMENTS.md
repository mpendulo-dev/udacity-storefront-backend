# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index [GET] /products
- Show [GET] /products/:id
- Create [POST] /products [token required]
- Update [PUT] /products/:id [token required]
- Delete [DELETE] /products/:id [token required]

#### Users

- Index [GET] /users
- Show [GET] /users/:id
- Create [POST] /user [token required]
- Update [PUT] /users/:id [token required]
- Delete [DELETE] /users/:id [token required]
- Authentication [POST] /user/authenticate [token required]

#### Orders

- Index [GET] /orders
- Show [GET] /orders/:id
- Create [POST] /orders [token required]
- Update [PUT] /orders/:id [token required]
- Delete [DELETE] /orders/:id [token required]

## Data Shapes

#### Product

- id
- name
- price

```bash
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  price INTEGER
);
```

#### User

- id
- firstName
- lastName
- username
- password_digest

```bash
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_digest TEXT
);
```

#### Orders

- id of each product in the order
- status of order
- user_id FK References user table

```bash
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50),
  user_id INTEGER REFERENCES users(id)
);
```
