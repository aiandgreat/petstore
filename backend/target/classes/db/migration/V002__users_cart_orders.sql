-- Users, cart_items, orders, order_items
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'CUSTOMER'
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  pet_id INTEGER,
  quantity INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  pet_id INTEGER,
  pet_name VARCHAR(255),
  unit_price_cents INTEGER,
  quantity INTEGER
);
