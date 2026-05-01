# API Contract: Pet Listing & Catalog Discovery

**Endpoint**: `/api/v1/pets`  
**Feature**: User Story 1 - Browse Pet Catalog  
**Priority**: P1

---

## GET /api/v1/pets

**Description**: Retrieve paginated list of available pets with filtering, searching, and sorting

**Method**: GET  
**Authentication**: Not required  
**Rate Limit**: 60 requests/minute

### Query Parameters

| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| `category` | string | No | null | Filter by pet type (DOG, CAT, BIRD, FISH) | `DOG` |
| `search` | string | No | null | Full-text search on pet name and breed | `"Golden Retriever"` |
| `min_price` | number | No | 0 | Minimum price filter (USD) | `50` |
| `max_price` | number | No | 10000 | Maximum price filter (USD) | `500` |
| `min_age` | number | No | 0 | Minimum age filter (months) | `6` |
| `max_age` | number | No | 240 | Maximum age filter (months) | `120` |
| `sort` | string | No | `created_at_desc` | Sort order: `price_asc`, `price_desc`, `created_at_desc`, `age_asc`, `age_desc` | `price_asc` |
| `limit` | number | No | 20 | Results per page (max 100) | `20` |
| `offset` | number | No | 0 | Pagination offset | `0` |

### Success Response (200 OK)

**Headers**:
```
Content-Type: application/json
X-Total-Count: 150
X-Page-Count: 8
```

**Body**:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "category": "DOG",
      "name": "Buddy",
      "breed": "Golden Retriever",
      "age_months": 12,
      "price": 450.00,
      "status": "AVAILABLE",
      "image_urls": [
        "https://cdn.example.com/pets/550e8400/buddy-1.webp",
        "https://cdn.example.com/pets/550e8400/buddy-2.webp"
      ],
      "description": "Friendly and energetic Golden Retriever puppy. Great with families.",
      "created_at": "2026-04-15T10:30:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "category": "DOG",
      "name": "Luna",
      "breed": "Labrador Mix",
      "age_months": 24,
      "price": 350.00,
      "status": "AVAILABLE",
      "image_urls": ["https://cdn.example.com/pets/660e8400/luna-1.webp"],
      "description": "Sweet and calm Labrador mix, excellent with children.",
      "created_at": "2026-04-10T14:20:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150,
    "has_next": true,
    "has_prev": false
  }
}
```

### Error Responses

**400 Bad Request** - Invalid filter parameters
```json
{
  "error": "INVALID_FILTER",
  "message": "max_price must be greater than min_price",
  "status": 400,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

**500 Internal Server Error** - Database error
```json
{
  "error": "INTERNAL_ERROR",
  "message": "Failed to retrieve pet listings",
  "status": 500,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

---

## GET /api/v1/pets/:id

**Description**: Retrieve detailed information for a specific pet

**Method**: GET  
**Authentication**: Not required

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Pet ID |

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "category": "DOG",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age_months": 12,
  "price": 450.00,
  "status": "AVAILABLE",
  "image_urls": [
    "https://cdn.example.com/pets/550e8400/buddy-1.webp",
    "https://cdn.example.com/pets/550e8400/buddy-2.webp"
  ],
  "description": "Friendly and energetic Golden Retriever puppy. Great with families and active households. Fully vaccinated and microchipped.",
  "created_at": "2026-04-15T10:30:00Z",
  "updated_at": "2026-04-20T15:45:00Z"
}
```

### Error Responses

**404 Not Found** - Pet does not exist
```json
{
  "error": "PET_NOT_FOUND",
  "message": "Pet with ID 550e8400-e29b-41d4-a716-446655440000 not found",
  "status": 404,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

---

## Implementation Notes

### Performance Optimization

- Catalog endpoint uses composite index: `(category, status, price)` for <100ms query time
- Results paginated max 100 per page to avoid memory bloat
- Image URLs stored as array; frontend responsible for responsive srcset
- Full-text search on (name, breed) uses PostgreSQL GIN index

### Caching

- Frontend caches catalog results in React Query for 5 minutes
- Backend can add Redis caching for product list (key: `pets:{category}:{sort}:{limit}:{offset}`)
- Cache invalidated when admin updates pet or adds new pet

### Frontend Integration

```typescript
// React Hook Form + React Query example
const { data, isLoading, error } = useQuery({
  queryKey: ['pets', { category, sort, minPrice, maxPrice }],
  queryFn: () => fetchPets({ category, sort, minPrice, maxPrice }),
  staleTime: 5 * 60 * 1000,  // 5 minutes
});

// Render pet cards with MUI Grid + Tailwind styling
return (
  <Grid container spacing={2}>
    {data?.data.map(pet => (
      <Grid item xs={12} sm={6} md={4} key={pet.id}>
        <PetCard pet={pet} onAddToCart={handleAddToCart} />
      </Grid>
    ))}
  </Grid>
);
```

---

**Status**: Complete — Ready for implementation
