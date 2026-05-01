# Data Model: E-Commerce MVP Platform

**Feature**: E-Commerce MVP Platform  
**Date**: 2026-05-01  
**Database**: PostgreSQL 18

## Entity Relationship Diagram

```
User (1) ──────────── (many) Pet
                      (via admin role)

User (1) ──────────── (many) CartItem
User (1) ──────────── (many) Order
User (1) ──────────── (many) Address

CartItem (many) ──── (1) Pet
CartItem (many) ──── (1) User

Order (1) ──────────── (many) OrderItem
Order (1) ──────────── (1) User
Order (1) ──────────── (1) Address (shipping)
Order (1) ──────────── (1) Address (billing)
Order (1) ──────────── (many) Transaction

OrderItem (many) ──── (1) Order
OrderItem (many) ──── (1) Pet (snapshot reference)

Pet (1) ──────────── (many) OrderItem
```

## Core Entities

### 1. User

**Purpose**: Represents a customer or administrator account

**Attributes**:
- `id` (UUID, Primary Key): Unique user identifier
- `email` (String, UNIQUE, NOT NULL): User email; used for login
- `password_hash` (String, NOT NULL): bcrypt-hashed password (field never returned in API responses)
- `full_name` (String): User's display name
- `role` (Enum: CUSTOMER, ADMIN, NOT NULL): Authorization level
- `is_active` (Boolean, NOT NULL, default=true): Soft-delete flag
- `created_at` (Timestamp, NOT NULL): Account creation timestamp
- `updated_at` (Timestamp, NOT NULL): Last profile update timestamp

**Constraints**:
- `UNIQUE(email)`: Prevents duplicate registrations
- `CHECK(email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')`: Email format validation

**Relationships**:
- 1 User → Many CartItem
- 1 User → Many Order
- 1 User → Many Address

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- INDEX (role) for quick admin user queries

---

### 2. Pet

**Purpose**: Represents a pet available for purchase

**Attributes**:
- `id` (UUID, Primary Key): Unique pet identifier
- `category` (Enum: DOG, CAT, BIRD, FISH, NOT NULL): Pet type for filtering
- `name` (String, NOT NULL): Pet name (e.g., "Buddy the Golden Retriever")
- `breed` (String, NOT NULL): Breed specification
- `age_months` (Integer, NOT NULL): Age in months (e.g., 6 for 6-month-old)
- `price` (Decimal(10,2), NOT NULL): Pet price in USD
- `description` (Text): Detailed pet information, personality traits
- `status` (Enum: AVAILABLE, SOLD, NOT NULL): Availability status
- `image_urls` (Text[], NOT NULL): Array of image URLs hosted on CDN
- `created_at` (Timestamp, NOT NULL): When pet was added to catalog
- `updated_at` (Timestamp, NOT NULL): Last modified timestamp

**Constraints**:
- `CHECK(price > 0)`: Price must be positive
- `CHECK(age_months >= 0)`: Age cannot be negative
- `CHECK(image_urls IS NOT NULL AND array_length(image_urls, 1) > 0)`: At least one image required

**Relationships**:
- 1 Pet → Many CartItem
- 1 Pet → Many OrderItem (via OrderItem snapshot)

**Indexes**:
- PRIMARY KEY (id)
- COMPOSITE INDEX (category, status, price) for fast catalog filtering
- FULL-TEXT INDEX on (name, breed) for search queries

---

### 3. CartItem

**Purpose**: Represents a pet selected by user but not yet ordered

**Attributes**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, NOT NULL): Owner of cart
- `pet_id` (UUID, Foreign Key → Pet, NOT NULL): Pet in cart
- `quantity` (Integer, NOT NULL, default=1): Number of this pet (typically 1 per pet in MVP)
- `added_at` (Timestamp, NOT NULL): When item was added to cart

**Constraints**:
- `UNIQUE(user_id, pet_id)`: Prevent duplicate cart items for same user/pet
- `CHECK(quantity > 0)`: Quantity must be positive
- `FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE`: Cart clears on user delete
- `FOREIGN KEY (pet_id) REFERENCES Pet(id) ON DELETE CASCADE`: Cart item removed if pet deleted

**Relationships**:
- Many CartItem → 1 User
- Many CartItem → 1 Pet

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id) for retrieving user's cart quickly
- UNIQUE INDEX (user_id, pet_id) for duplicate prevention

---

### 4. Order

**Purpose**: Represents a completed purchase with shipping and billing info

**Attributes**:
- `id` (UUID, Primary Key)
- `order_number` (String, UNIQUE, NOT NULL): Human-readable order ID (e.g., "ORD-2026-0001")
- `user_id` (UUID, Foreign Key → User, NOT NULL): Customer who placed order
- `subtotal` (Decimal(10,2), NOT NULL): Sum of pet prices
- `tax` (Decimal(10,2), NOT NULL): Tax amount
- `total` (Decimal(10,2), NOT NULL): subtotal + tax
- `status` (Enum: PROCESSING, SHIPPED, DELIVERED, NOT NULL): Fulfillment status
- `shipping_address_id` (UUID, Foreign Key → Address, NOT NULL): Delivery address
- `billing_address_id` (UUID, Foreign Key → Address, NOT NULL): Payment address
- `created_at` (Timestamp, NOT NULL): Order placement time
- `shipped_at` (Timestamp): When order was shipped (NULL until shipped)
- `delivered_at` (Timestamp): When order was delivered (NULL until delivered)
- `updated_at` (Timestamp, NOT NULL): Last status update

**Constraints**:
- `CHECK(total = subtotal + tax)`: Data integrity on totals
- `CHECK(total > 0)`: Order total must be positive
- `FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE RESTRICT`: Orders tied to user
- `FOREIGN KEY (shipping_address_id) REFERENCES Address(id)`
- `FOREIGN KEY (billing_address_id) REFERENCES Address(id)`

**Relationships**:
- Many Order → 1 User
- 1 Order → Many OrderItem
- 1 Order → Many Transaction
- 1 Order → 1 Address (shipping)
- 1 Order → 1 Address (billing)

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX (order_number)
- INDEX (user_id, created_at DESC) for order history queries
- INDEX (status) for admin fulfillment queries

---

### 5. OrderItem

**Purpose**: Represents a pet purchased as part of an order (snapshot at purchase time)

**Attributes**:
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Order, NOT NULL): Parent order
- `pet_id` (UUID, Foreign Key → Pet, NOT NULL): Reference to original pet listing (for inventory)
- `pet_name_snapshot` (String, NOT NULL): Pet name at time of purchase (for receipts)
- `pet_breed_snapshot` (String, NOT NULL): Breed at time of purchase
- `unit_price` (Decimal(10,2), NOT NULL): Price paid for this pet
- `quantity` (Integer, NOT NULL, default=1): Number of units ordered
- `created_at` (Timestamp, NOT NULL)

**Constraints**:
- `CHECK(unit_price > 0)`: Price must be positive
- `CHECK(quantity > 0)`: Quantity must be positive
- `FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE CASCADE`
- `FOREIGN KEY (pet_id) REFERENCES Pet(id) ON DELETE RESTRICT`: Keep reference for audit

**Purpose of Snapshot Fields**: 
If a pet's name or price changes after purchase, the order receipt still shows accurate historical data. OrderItem captures the state at purchase time; Pet table can be updated for future orders.

**Relationships**:
- Many OrderItem → 1 Order
- Many OrderItem → 1 Pet

**Indexes**:
- PRIMARY KEY (id)
- INDEX (order_id) for retrieving order line items

---

### 6. Address

**Purpose**: Represents a shipping or billing address for users and orders

**Attributes**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User, NOT NULL): Owner of address
- `full_name` (String, NOT NULL): Recipient name
- `street_address` (String, NOT NULL): Street address
- `city` (String, NOT NULL): City
- `state` (String, NOT NULL): State/Province (e.g., "CA", "NY")
- `postal_code` (String, NOT NULL): ZIP/Postal code
- `country` (String, NOT NULL, default="US"): Country code
- `phone_number` (String): Phone number for delivery contact
- `address_type` (Enum: SHIPPING, BILLING, NOT NULL): Purpose of address
- `is_default` (Boolean, NOT NULL, default=false): Whether this is user's default
- `created_at` (Timestamp, NOT NULL)
- `updated_at` (Timestamp, NOT NULL)

**Constraints**:
- `FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE`
- `CHECK(street_address ~ '[0-9]')`: Require house number in street
- `CHECK(postal_code ~ '^[0-9]{5}(-[0-9]{4})?$')`: US ZIP format validation

**Relationships**:
- Many Address → 1 User
- 1 Address → Many Order (as shipping_address_id or billing_address_id)

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id, is_default) for quick default address lookup

---

### 7. Transaction

**Purpose**: Audit log for payment processing events (Stripe/PayPal interactions)

**Attributes**:
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → Order, NOT NULL): Associated order
- `payment_provider` (Enum: STRIPE, PAYPAL, NOT NULL): Which provider processed payment
- `provider_transaction_id` (String, NOT NULL, UNIQUE): External payment ID from provider
- `amount` (Decimal(10,2), NOT NULL): Amount charged in USD
- `currency` (String, NOT NULL, default="USD"): Currency code
- `status` (Enum: PENDING, SUCCESS, FAILED, REFUNDED, NOT NULL): Payment result
- `error_message` (Text): Reason if status is FAILED
- `created_at` (Timestamp, NOT NULL): Payment attempt timestamp
- `updated_at` (Timestamp, NOT NULL): Last status update

**Constraints**:
- `CHECK(amount > 0)`: Transaction amount must be positive
- `UNIQUE(provider_transaction_id)`: Prevent duplicate payment processing
- `FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE RESTRICT`: Audit trail preservation

**Important**: This table NEVER stores card numbers, CVV, or sensitive payment data. Stripe/PayPal handles card security.

**Relationships**:
- Many Transaction → 1 Order

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX (provider_transaction_id)
- INDEX (order_id, created_at DESC) for payment history

---

## Database Migrations

**Strategy**: Flyway version-controlled migrations in `backend/src/main/resources/db/migration/`

**Migration Naming**: `V001__initial_schema.sql`, `V002__add_transaction_table.sql`, etc.

**Phase 1 (V001)**: 
- Create User, Pet, CartItem, Order, OrderItem, Address, Transaction tables
- Add foreign key constraints
- Add indexes for performance

**Rollback Strategy**: Each migration includes a down migration (though Flyway doesn't auto-rollback); manual SQL down scripts in version control

**Schema Versioning**: Flyway `schema_version` table tracks applied migrations; prevents duplicate execution

---

## Query Patterns

### Catalog Discovery
```sql
SELECT * FROM Pet 
WHERE category = $1 
  AND status = 'AVAILABLE' 
  AND price BETWEEN $2 AND $3
ORDER BY price ASC
LIMIT 20 OFFSET $4;
```
**Index**: (category, status, price)

### User's Cart
```sql
SELECT ci.id, ci.quantity, p.* 
FROM CartItem ci
JOIN Pet p ON ci.pet_id = p.id
WHERE ci.user_id = $1;
```
**Index**: (user_id) on CartItem

### Order History
```sql
SELECT * FROM Order 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 20;
```
**Index**: (user_id, created_at DESC)

---

## Data Integrity Guarantees

- **ACID Transactions**: Order placement and inventory update happen in single transaction; atomicity ensures consistency
- **Foreign Keys**: Orphaned orders/items prevented by constraints
- **Uniqueness**: No duplicate emails, duplicate order numbers, duplicate provider transaction IDs
- **Checksums**: Totals (subtotal + tax = total) validated at database level
- **Audit Trail**: Transaction table immutable once created; no updates allowed

---

**Next**: Proceed with API contract specification in `contracts/` directory
