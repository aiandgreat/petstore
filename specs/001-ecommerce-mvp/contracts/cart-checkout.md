# API Contract: Shopping Cart & Checkout

**Endpoints**: `/api/v1/cart/`, `/api/v1/checkout/`  
**Feature**: User Story 3 - Shopping Cart & Multi-Step Checkout  
**Priority**: P2

---

## GET /api/v1/cart

**Description**: Retrieve current user's shopping cart with items and pricing

**Method**: GET  
**Authentication**: Required (JWT)

### Success Response (200 OK)

```json
{
  "id": "cart_550e8400",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "cartitem_001",
      "pet_id": "pet_550e8400",
      "pet_name": "Buddy",
      "pet_breed": "Golden Retriever",
      "pet_image": "https://cdn.example.com/pets/550e8400/buddy-1.webp",
      "price": 450.00,
      "quantity": 1,
      "subtotal": 450.00,
      "status": "AVAILABLE",
      "added_at": "2026-05-01T10:00:00Z"
    },
    {
      "id": "cartitem_002",
      "pet_id": "pet_660e8400",
      "pet_name": "Luna",
      "pet_breed": "Labrador Mix",
      "pet_image": "https://cdn.example.com/pets/660e8400/luna-1.webp",
      "price": 350.00,
      "quantity": 1,
      "subtotal": 350.00,
      "status": "AVAILABLE",
      "added_at": "2026-05-01T11:00:00Z"
    }
  ],
  "totals": {
    "subtotal": 800.00,
    "tax": 80.00,
    "total": 880.00
  },
  "item_count": 2
}
```

### Error Responses

**401 Unauthorized** - Not authenticated
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required",
  "status": 401
}
```

---

## POST /api/v1/cart

**Description**: Add pet to shopping cart (or update quantity if already in cart)

**Method**: POST  
**Authentication**: Required (JWT)

### Request Body

```json
{
  "pet_id": "pet_550e8400",
  "quantity": 1
}
```

### Success Response (201 Created)

```json
{
  "id": "cartitem_001",
  "pet_id": "pet_550e8400",
  "quantity": 1,
  "subtotal": 450.00,
  "message": "Pet added to cart successfully"
}
```

### Error Responses

**400 Bad Request** - Invalid pet or quantity
```json
{
  "error": "INVALID_REQUEST",
  "message": "Quantity must be greater than 0",
  "status": 400
}
```

**409 Conflict** - Pet not available
```json
{
  "error": "PET_NOT_AVAILABLE",
  "message": "This pet is no longer available for purchase",
  "status": 409
}
```

---

## DELETE /api/v1/cart/:cartItemId

**Description**: Remove item from shopping cart

**Method**: DELETE  
**Authentication**: Required (JWT)

### Success Response (204 No Content)

No body

### Error Responses

**404 Not Found** - Cart item does not exist
```json
{
  "error": "CART_ITEM_NOT_FOUND",
  "message": "Cart item not found",
  "status": 404
}
```

---

## POST /api/v1/checkout/orders

**Description**: Create order from cart items and initiate checkout process

**Method**: POST  
**Authentication**: Required (JWT)

### Request Body

```json
{
  "shipping_address_id": "addr_660e8400",
  "billing_address_id": "addr_770e8400"
}
```

**Validation**:
- Both addresses must belong to authenticated user
- Cart must have at least 1 item
- All items must still be AVAILABLE

### Success Response (201 Created)

```json
{
  "order_id": "order_880e8400",
  "order_number": "ORD-2026-0001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PENDING_PAYMENT",
  "items": [
    {
      "pet_id": "pet_550e8400",
      "pet_name": "Buddy",
      "unit_price": 450.00,
      "quantity": 1
    }
  ],
  "shipping_address": {
    "id": "addr_660e8400",
    "full_name": "John Doe",
    "street_address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postal_code": "62701"
  },
  "billing_address": {
    "id": "addr_770e8400",
    "full_name": "John Doe",
    "street_address": "456 Oak Ave",
    "city": "Chicago",
    "state": "IL",
    "postal_code": "60601"
  },
  "totals": {
    "subtotal": 800.00,
    "tax": 80.00,
    "total": 880.00
  },
  "created_at": "2026-05-01T12:00:00Z"
}
```

### Error Responses

**409 Conflict** - Pet unavailable or cart invalid
```json
{
  "error": "CART_INVALID",
  "message": "One or more items in your cart are no longer available. Please review your cart.",
  "status": 409,
  "unavailable_items": ["pet_550e8400"]
}
```

**422 Unprocessable Entity** - Insufficient inventory
```json
{
  "error": "INSUFFICIENT_INVENTORY",
  "message": "Not enough inventory for pet 'Buddy'",
  "status": 422
}
```

---

## POST /api/v1/checkout/payment

**Description**: Process payment for order using Stripe/PayPal token

**Method**: POST  
**Authentication**: Required (JWT)

### Request Body

```json
{
  "order_id": "order_880e8400",
  "stripe_token": "tok_visa",
  "payment_method": "stripe"
}
```

### Success Response (200 OK)

```json
{
  "order_id": "order_880e8400",
  "order_number": "ORD-2026-0001",
  "payment_status": "SUCCESS",
  "message": "Payment processed successfully",
  "receipt_url": "https://example.com/receipts/order_880e8400",
  "estimated_delivery": "2026-05-08T00:00:00Z"
}
```

### Error Responses

**402 Payment Required** - Payment declined
```json
{
  "error": "PAYMENT_DECLINED",
  "message": "Your card was declined. Please check your information and try again.",
  "status": 402,
  "provider_error": "card_declined"
}
```

**400 Bad Request** - Invalid payment details
```json
{
  "error": "INVALID_PAYMENT",
  "message": "Invalid payment token",
  "status": 400
}
```

---

## GET /api/v1/checkout/orders/:orderId

**Description**: Retrieve order details and payment status

**Method**: GET  
**Authentication**: Required (JWT)

### Success Response (200 OK)

```json
{
  "id": "order_880e8400",
  "order_number": "ORD-2026-0001",
  "status": "PROCESSING",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "pet_name": "Buddy",
      "pet_breed": "Golden Retriever",
      "unit_price": 450.00,
      "quantity": 1,
      "subtotal": 450.00
    }
  ],
  "shipping_address": {
    "full_name": "John Doe",
    "street_address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postal_code": "62701"
  },
  "payment": {
    "status": "SUCCESS",
    "provider": "stripe",
    "amount": 880.00,
    "processed_at": "2026-05-01T12:05:00Z"
  },
  "totals": {
    "subtotal": 800.00,
    "tax": 80.00,
    "total": 880.00
  },
  "created_at": "2026-05-01T12:00:00Z"
}
```

---

## Implementation Notes

### Cart Persistence

- Cart stored in database (not browser localStorage) for cross-device sync
- Cart persists for 30 days after creation even without login
- When user logs in, session cart merged with saved cart (avoiding duplicates)

### Checkout Flow

```
1. GET /cart → Validate items still available
2. POST /checkout/orders → Create order, reserve inventory, change pet status to SOLD
3. POST /checkout/payment → Stripe/PayPal processes payment
4. On success: Order.status = PROCESSING; cart cleared
5. On failure: Order.status = PAYMENT_FAILED; cart preserved; user can retry
```

### Payment Processing

- Stripe/PayPal handles card data; only tokens transmitted to backend
- Payment transaction logged in Transaction table with provider_id
- Webhook from Stripe/PayPal updates order status when payment confirmed
- Retry mechanism for failed payments (user can attempt checkout again)

### Tax Calculation

MVP uses simple tax: 10% of subtotal. Future iterations can add:
- Location-based tax rates
- Tax exemptions
- Integration with TaxJar API

### Frontend Integration

```typescript
// React Hook Form for checkout
const { register, handleSubmit, errors } = useForm();

// Step 1: Shipping Address
const Step1 = () => (
  <form>
    <input {...register('street', { required: true })} placeholder="Street Address" />
    {/* More fields */}
  </form>
);

// Step 2: Billing Address
const Step2 = () => (
  <Checkbox {...register('sameBilling')} label="Use shipping address" />
);

// Step 3: Payment (Stripe integration)
const Step3 = () => (
  <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
);

// Submit order
const onSubmit = async (data) => {
  const order = await createOrder(data);
  const payment = await processPayment(order.id, stripeToken);
  navigate(`/order-confirmation/${order.order_number}`);
};
```

---

**Status**: Complete — Ready for implementation
