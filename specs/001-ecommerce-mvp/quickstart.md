# Quick Start: Integration Scenarios & Local Setup

**Feature**: E-Commerce MVP Platform  
**Date**: 2026-05-01

## Local Development Environment

### Prerequisites
- Docker and Docker Compose installed
- Java 17 JDK (for backend IDE support)
- Node.js 18+ (for frontend IDE support)
- Git

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone <repo> petstore
   cd petstore
   git checkout 001-ecommerce-mvp
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```
   
   Services started:
   - PostgreSQL 18 on localhost:5432 (user: petstore, password: dev_password)
   - Spring Boot backend on localhost:8080
   - React frontend on localhost:3000

3. **Backend Setup** (in `backend/` directory)
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   
   Flyway auto-runs migrations on startup; schema created in PostgreSQL

4. **Frontend Setup** (in `frontend/` directory)
   ```bash
   npm install
   npm run dev
   ```
   
   Vite dev server starts on localhost:3000 with instant HMR (Hot Module Replacement) on file changes

5. **Verify Installation**
   - Frontend (Vite): Open http://localhost:3000 → Should see Petstore home page with hot reload enabled
   - Backend: GET http://localhost:8080/api/v1/pets → Should return empty array []
   - Database: `psql -h localhost -U petstore -d petstore` → \dt lists all tables
   - Vite HMR: Edit a React component file; changes should appear instantly in browser

### Environment Variables

Create `.env` file at repository root:
```
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/petstore
SPRING_DATASOURCE_USERNAME=petstore
SPRING_DATASOURCE_PASSWORD=dev_password
STRIPE_SECRET_KEY=sk_test_xxx
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION_MS=900000

# Frontend
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
```

---

## Integration Scenarios

### Scenario 1: Customer Browsing & Adding to Cart

**Preconditions**: 
- Backend running with seeded pet catalog (V001 migration loads 10 sample pets)
- User has account with JWT token

**Steps**:
1. Frontend: GET `/api/v1/pets?category=DOG&sort=price_asc&limit=20`
2. Backend returns paginated list with pet details, images
3. Frontend displays catalog with filter/sort UI (Tailwind + MUI components)
4. User clicks "Add to Cart" on a pet
5. Frontend: POST `/api/v1/cart` with `{ pet_id: "xxx", quantity: 1 }`
6. Backend: Creates CartItem in database, verifies pet is AVAILABLE
7. Frontend updates cart badge; displays success toast

**Expected Outcome**: CartItem created in database; cart count incremented in UI

---

### Scenario 2: User Authentication

**Preconditions**: None

**Steps**:
1. User navigates to `/signup`
2. Frontend displays signup form (React Hook Form with Tailwind styling)
3. User enters email, password, confirms password
4. Frontend validates locally; shows field errors if invalid
5. Frontend: POST `/api/v1/auth/signup` with credentials
6. Backend: 
   - Validates email format, password length
   - Checks email uniqueness
   - bcrypts password
   - Creates User record with CUSTOMER role
   - Returns JWT token + refresh token in HttpOnly cookie
7. Frontend: Stores JWT in context; redirects to catalog
8. Subsequent requests include Authorization header: `Bearer <jwt_token>`

**Expected Outcome**: User account created; logged in; JWT token in secure cookie

---

### Scenario 3: Multi-Step Checkout

**Preconditions**:
- User is logged in
- User has items in cart
- User has no saved addresses

**Steps**:

**Step 1 - Shipping Address**:
1. User navigates to `/checkout`
2. Frontend fetches `/api/v1/cart` to validate items still available
3. Frontend displays Checkout Wizard Step 1 (MUI Stepper)
4. User fills shipping form (name, address, city, state, zip)
5. Frontend validates fields; shows errors if invalid
6. Frontend: POST `/api/v1/address` with address details and type=SHIPPING
7. Backend creates Address record; returns address_id
8. User clicks "Next" → Advances to Step 2

**Step 2 - Billing Address**:
1. Frontend displays Billing Address form
2. Checkbox "Use shipping address as billing" (pre-checked)
3. If user selects custom billing, shows form similar to Step 1
4. User clicks "Next" → Advances to Step 3

**Step 3 - Order Review**:
1. Frontend fetches cart again; displays summary
2. Shows items, quantities, prices, shipping/billing addresses
3. Displays total (subtotal + tax)
4. User clicks "Place Order"
5. Frontend: POST `/api/v1/checkout/orders` with:
   ```json
   {
     "shipping_address_id": "addr_xxx",
     "billing_address_id": "addr_yyy"
   }
   ```
6. Backend:
   - Fetches cart items
   - Verifies all pets still AVAILABLE
   - Begins transaction
   - Creates Order record with status=PROCESSING
   - Creates OrderItem records for each cart item (with snapshot data)
   - Updates Pet.status to SOLD for each purchased pet
   - Clears cart (deletes CartItem records)
   - Returns order_id
7. Frontend: Calls `/api/v1/checkout/payment` with order_id
8. Backend initiates Stripe payment intent; returns clientSecret
9. Frontend uses Stripe.js to collect payment; sends token to backend
10. Backend: Verifies payment with Stripe; creates Transaction record
11. On success: Order.status updated to PROCESSING; fulfillment email sent
12. Frontend redirects to `/order-confirmation/order_xxx`

**Expected Outcome**: Order created; inventory decremented; payment processed; confirmation page displayed

---

### Scenario 4: Admin Adding New Pet

**Preconditions**:
- User logged in with ADMIN role
- User navigates to `/admin/inventory`

**Steps**:
1. Frontend displays Admin Dashboard (MUI DataGrid showing current pets)
2. Admin clicks "Add New Pet"
3. Frontend shows modal/form with fields:
   - Category (dropdown: Dog, Cat, Bird, Fish)
   - Name, Breed
   - Age (months)
   - Price (USD)
   - Description (textarea)
   - Images (file upload with preview)
4. Admin fills form; clicks Save
5. Frontend: POST `/api/v1/admin/pets` with multipart form data (images uploaded to CDN separately)
6. Backend:
   - Validates input (price > 0, age >= 0, images provided)
   - Stores images in cloud storage (e.g., AWS S3); returns URLs
   - Creates Pet record with status=AVAILABLE
   - Returns pet_id
7. Frontend: Modal closes; new pet appears in DataGrid; success toast

**Expected Outcome**: New pet listed in catalog; available for customer purchase

---

### Scenario 5: Order Status Tracking

**Preconditions**:
- User has placed order; order exists in database with status=PROCESSING

**Steps**:
1. User navigates to `/orders` (Order History page)
2. Frontend: GET `/api/v1/orders` with pagination
3. Backend returns list of user's orders sorted by created_at DESC
4. Frontend displays orders in MUI DataGrid with columns: Order #, Date, Total, Status
5. User clicks order row to view details
6. Frontend: GET `/api/v1/orders/:order_id`
7. Backend returns order details including:
   - Order items (pet names, quantities, unit prices)
   - Shipping address
   - Billing address
   - Total
   - Status (PROCESSING, SHIPPED, or DELIVERED)
   - Timestamps (created, shipped, delivered)
8. Frontend displays order detail page with status badge and timeline
9. Admin updates status via: PATCH `/api/v1/admin/orders/:order_id` with new status
10. Backend updates Order.status; sends notification email to customer
11. Frontend polls `/api/v1/orders/:order_id` every 30 seconds; updates status badge when changed

**Expected Outcome**: User sees accurate order history and real-time status updates

---

## API Testing

### Using Postman/Insomnia

1. **Auth Flow** (for testing):
   - POST http://localhost:8080/api/v1/auth/signup
   - Body: `{ "email": "test@example.com", "password": "TestPass123" }`
   - Response includes JWT token in Set-Cookie header
   - Copy token; add to Authorization header for subsequent requests

2. **Catalog Listing**:
   - GET http://localhost:8080/api/v1/pets?category=DOG&sort=price_asc

3. **Cart Operations**:
   - POST http://localhost:8080/api/v1/cart (requires JWT)
   - Body: `{ "pet_id": "uuid", "quantity": 1 }`

### Using cURL

```bash
# Signup
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123"}' \
  -c cookies.txt

# Browse catalog (with JWT from login)
curl -X GET "http://localhost:8080/api/v1/pets?category=DOG" \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused on localhost:8080 | Backend not running | `mvn spring-boot:run` in backend/ |
| "Unknown database 'petstore'" | PostgreSQL not initialized | `docker-compose up -d` ensures DB exists |
| CORS errors in frontend | Backend CORS config | Check @CrossOrigin annotations in controllers |
| JWT validation fails | Token expired or invalid signature | Re-login to get fresh token |
| Images not loading | CDN URL not configured | Set REACT_APP_IMAGE_CDN_URL in .env |

---

**Next Steps**:
1. Review API contracts in `contracts/` directory
2. Verify all endpoints match OpenAPI spec
3. Run integration tests: `mvn verify` (backend), `npm run test` (frontend)
4. Deploy to Render staging for E2E testing
