# API Contract: Order Management & Admin

**Endpoints**: `/api/v1/orders/`, `/api/v1/admin/`  
**Feature**: User Stories 4 & 5 - Order Tracking & Admin Inventory Management  
**Priority**: P2

---

## GET /api/v1/orders

**Description**: Retrieve paginated order history for authenticated user

**Method**: GET  
**Authentication**: Required (JWT)

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | null | Filter by status: PROCESSING, SHIPPED, DELIVERED |
| `limit` | number | 20 | Results per page (max 100) |
| `offset` | number | 0 | Pagination offset |

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "order_880e8400",
      "order_number": "ORD-2026-0001",
      "status": "DELIVERED",
      "total": 880.00,
      "item_count": 1,
      "created_at": "2026-04-25T10:00:00Z",
      "shipped_at": "2026-04-26T14:30:00Z",
      "delivered_at": "2026-04-28T16:00:00Z"
    },
    {
      "id": "order_990e8400",
      "order_number": "ORD-2026-0002",
      "status": "PROCESSING",
      "total": 1250.00,
      "item_count": 2,
      "created_at": "2026-05-01T12:00:00Z",
      "shipped_at": null,
      "delivered_at": null
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 15,
    "has_next": false,
    "has_prev": false
  }
}
```

---

## GET /api/v1/orders/:orderId

**Description**: Retrieve detailed information for a specific order

**Method**: GET  
**Authentication**: Required (JWT)

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | UUID | Order ID |

### Success Response (200 OK)

```json
{
  "id": "order_880e8400",
  "order_number": "ORD-2026-0001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PROCESSING",
  "items": [
    {
      "id": "orderitem_001",
      "pet_name": "Buddy",
      "pet_breed": "Golden Retriever",
      "unit_price": 450.00,
      "quantity": 1,
      "subtotal": 450.00
    },
    {
      "id": "orderitem_002",
      "pet_name": "Luna",
      "pet_breed": "Labrador Mix",
      "unit_price": 350.00,
      "quantity": 1,
      "subtotal": 350.00
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
  "fulfillment": {
    "status": "PROCESSING",
    "estimated_ship_date": "2026-05-03T00:00:00Z",
    "tracking_number": null,
    "carrier": null
  },
  "totals": {
    "subtotal": 800.00,
    "tax": 80.00,
    "total": 880.00
  },
  "created_at": "2026-05-01T12:00:00Z",
  "updated_at": "2026-05-01T12:00:00Z"
}
```

### Error Responses

**403 Forbidden** - User cannot view this order
```json
{
  "error": "FORBIDDEN",
  "message": "You do not have permission to view this order",
  "status": 403
}
```

**404 Not Found** - Order does not exist
```json
{
  "error": "ORDER_NOT_FOUND",
  "message": "Order not found",
  "status": 404
}
```

---

## POST /api/v1/admin/pets

**Description**: Create new pet listing (admin only)

**Method**: POST  
**Authentication**: Required (JWT, ADMIN role)
**Content-Type**: multipart/form-data

### Request Body

```json
{
  "category": "DOG",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age_months": 12,
  "price": 450.00,
  "description": "Friendly and energetic Golden Retriever puppy. Great with families.",
  "images": [<File: buddy-1.jpg>, <File: buddy-2.jpg>]
}
```

### Success Response (201 Created)

```json
{
  "id": "pet_550e8400",
  "category": "DOG",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age_months": 12,
  "price": 450.00,
  "description": "Friendly and energetic Golden Retriever puppy. Great with families.",
  "status": "AVAILABLE",
  "image_urls": [
    "https://cdn.example.com/pets/550e8400/buddy-1.webp",
    "https://cdn.example.com/pets/550e8400/buddy-2.webp"
  ],
  "created_at": "2026-05-01T12:00:00Z"
}
```

### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "error": "INVALID_REQUEST",
  "message": "Price must be greater than 0",
  "status": 400
}
```

**401 Unauthorized** - Not authenticated
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required",
  "status": 401
}
```

**403 Forbidden** - User is not admin
```json
{
  "error": "FORBIDDEN",
  "message": "Only administrators can create pet listings",
  "status": 403
}
```

---

## PATCH /api/v1/admin/pets/:petId

**Description**: Update existing pet listing

**Method**: PATCH  
**Authentication**: Required (JWT, ADMIN role)

### Request Body

```json
{
  "name": "Buddy Jr.",
  "price": 475.00,
  "age_months": 13,
  "status": "AVAILABLE"
}
```

### Success Response (200 OK)

```json
{
  "id": "pet_550e8400",
  "category": "DOG",
  "name": "Buddy Jr.",
  "breed": "Golden Retriever",
  "age_months": 13,
  "price": 475.00,
  "status": "AVAILABLE",
  "updated_at": "2026-05-01T13:00:00Z"
}
```

---

## DELETE /api/v1/admin/pets/:petId

**Description**: Remove pet listing from catalog

**Method**: DELETE  
**Authentication**: Required (JWT, ADMIN role)

### Success Response (204 No Content)

No body

### Error Responses

**404 Not Found** - Pet does not exist
```json
{
  "error": "PET_NOT_FOUND",
  "message": "Pet not found",
  "status": 404
}
```

---

## GET /api/v1/admin/orders

**Description**: Retrieve all orders for fulfillment management

**Method**: GET  
**Authentication**: Required (JWT, ADMIN role)

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | null | Filter: PROCESSING, SHIPPED, DELIVERED |
| `sort` | string | created_at_desc | Sort: created_at_desc, created_at_asc |
| `limit` | number | 50 | Results per page |
| `offset` | number | 0 | Pagination offset |

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "order_880e8400",
      "order_number": "ORD-2026-0001",
      "customer": "john@example.com",
      "status": "PROCESSING",
      "total": 880.00,
      "item_count": 1,
      "created_at": "2026-05-01T12:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 42,
    "has_next": true
  }
}
```

---

## PATCH /api/v1/admin/orders/:orderId

**Description**: Update order fulfillment status

**Method**: PATCH  
**Authentication**: Required (JWT, ADMIN role)

### Request Body

```json
{
  "status": "SHIPPED",
  "tracking_number": "1Z999AA10123456784",
  "carrier": "UPS"
}
```

### Success Response (200 OK)

```json
{
  "id": "order_880e8400",
  "order_number": "ORD-2026-0001",
  "status": "SHIPPED",
  "fulfillment": {
    "status": "SHIPPED",
    "tracking_number": "1Z999AA10123456784",
    "carrier": "UPS",
    "shipped_at": "2026-05-02T14:30:00Z"
  },
  "updated_at": "2026-05-02T14:30:00Z"
}
```

### Webhook Trigger

When order status changes, background job sends notification email to customer:
```
Subject: Your Order ORD-2026-0001 has shipped!
Body: Your order is on the way. Tracking: 1Z999AA10123456784
```

---

## Implementation Notes

### Role-Based Access Control

```java
@GetMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Page<OrderDTO>> getAdminOrders(...) {
  // Only accessible to users with ADMIN role
}
```

### Admin Inventory Dashboard

Frontend displays:
- DataGrid of all pets with columns: ID, Name, Category, Price, Status, Created
- Bulk actions: Mark as SOLD, Delete, Update Price
- Add New Pet form with image upload

```typescript
<DataGrid
  columns={[
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => editPet(params.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deletePet(params.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ]}
  rows={pets}
/>
```

### Image Upload

Images uploaded to cloud storage (AWS S3 recommended):
- Multipart upload in backend
- Images converted to WebP format
- URLs stored in Pet.image_urls array
- CDN distribution for fast delivery

### Inventory Locking

During checkout, pessimistic locking prevents double-sales:
```sql
SELECT * FROM Pet WHERE id = $1 FOR UPDATE;
-- Transaction holds lock until commit/rollback
-- If pet already SOLD, transaction fails with conflict error
```

---

**Status**: Complete — Ready for implementation
