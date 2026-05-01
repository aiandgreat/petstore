# API Contract: Authentication & Account Management

**Endpoints**: `/api/v1/auth/`, `/api/v1/account/`  
**Feature**: User Story 2 - User Authentication & Account Management  
**Priority**: P1

---

## POST /api/v1/auth/signup

**Description**: Create new user account

**Method**: POST  
**Authentication**: None  
**Rate Limit**: 5 requests/minute per IP

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Validation**:
- `email`: Required, valid email format, max 255 chars, must be unique
- `password`: Required, min 8 chars, max 128 chars

### Success Response (201 Created)

**Headers**:
```
Set-Cookie: jwt=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=900000
Set-Cookie: refresh_token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800000
Content-Type: application/json
```

**Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": null,
  "role": "CUSTOMER",
  "created_at": "2026-05-01T12:00:00Z"
}
```

### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "error": "INVALID_REQUEST",
  "message": "Password must be at least 8 characters",
  "status": 400,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

**409 Conflict** - Email already registered
```json
{
  "error": "EMAIL_EXISTS",
  "message": "Email user@example.com is already registered",
  "status": 409,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

---

## POST /api/v1/auth/login

**Description**: Authenticate user and receive JWT token

**Method**: POST  
**Authentication**: None  
**Rate Limit**: 10 requests/minute per IP

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Success Response (200 OK)

**Headers**: (same as signup — JWT + refresh token in HttpOnly cookies)

**Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "CUSTOMER"
}
```

### Error Responses

**401 Unauthorized** - Invalid credentials
```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect",
  "status": 401,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many login attempts. Try again in 15 minutes.",
  "status": 429,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

---

## POST /api/v1/auth/logout

**Description**: End user session and invalidate tokens

**Method**: POST  
**Authentication**: Required (JWT)

### Success Response (200 OK)

**Headers**:
```
Set-Cookie: jwt=; Max-Age=0
Set-Cookie: refresh_token=; Max-Age=0
```

**Body**:
```json
{
  "message": "Successfully logged out"
}
```

---

## POST /api/v1/auth/refresh

**Description**: Refresh JWT token using refresh token

**Method**: POST  
**Authentication**: Requires valid refresh_token in cookie

### Success Response (200 OK)

**Headers**:
```
Set-Cookie: jwt=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=900000
```

**Body**:
```json
{
  "message": "Token refreshed"
}
```

### Error Responses

**401 Unauthorized** - Refresh token invalid or expired
```json
{
  "error": "INVALID_REFRESH_TOKEN",
  "message": "Refresh token expired or invalid",
  "status": 401,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

---

## GET /api/v1/account/profile

**Description**: Get current user profile information

**Method**: GET  
**Authentication**: Required (JWT)

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "CUSTOMER",
  "created_at": "2026-04-01T08:00:00Z",
  "updated_at": "2026-05-01T12:00:00Z",
  "addresses": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "full_name": "John Doe",
      "street_address": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "postal_code": "62701",
      "country": "US",
      "address_type": "SHIPPING",
      "is_default": true
    }
  ]
}
```

---

## PATCH /api/v1/account/profile

**Description**: Update user profile (name, addresses)

**Method**: PATCH  
**Authentication**: Required (JWT)

### Request Body

```json
{
  "full_name": "John Doe"
}
```

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "CUSTOMER",
  "updated_at": "2026-05-01T13:00:00Z"
}
```

---

## POST /api/v1/address

**Description**: Create or update user address (for shipping/billing)

**Method**: POST  
**Authentication**: Required (JWT)

### Request Body

```json
{
  "full_name": "John Doe",
  "street_address": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "postal_code": "62701",
  "country": "US",
  "phone_number": "+1-217-555-0123",
  "address_type": "SHIPPING",
  "is_default": false
}
```

### Success Response (201 Created)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "full_name": "John Doe",
  "street_address": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "postal_code": "62701",
  "country": "US",
  "phone_number": "+1-217-555-0123",
  "address_type": "SHIPPING",
  "is_default": false,
  "created_at": "2026-05-01T12:00:00Z"
}
```

### Error Responses

**400 Bad Request** - Invalid address format
```json
{
  "error": "INVALID_ADDRESS",
  "message": "Invalid postal code format for US addresses",
  "status": 400,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

---

## GET /api/v1/address

**Description**: Get all user addresses

**Method**: GET  
**Authentication**: Required (JWT)

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "full_name": "John Doe",
      "street_address": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "postal_code": "62701",
      "country": "US",
      "address_type": "SHIPPING",
      "is_default": true
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "full_name": "Jane Doe",
      "street_address": "456 Oak Ave",
      "city": "Chicago",
      "state": "IL",
      "postal_code": "60601",
      "country": "US",
      "address_type": "BILLING",
      "is_default": false
    }
  ]
}
```

---

## Implementation Notes

### Security

- Passwords bcrypted with salt factor 12 (>10 seconds on modern hardware)
- JWT token: 15-minute expiration; refresh token: 7-day expiration
- HttpOnly cookies prevent XSS token theft
- Secure flag ensures HTTPS-only transmission
- Rate limiting prevents brute-force attacks on login
- Account lockout after 5 failed login attempts for 15 minutes

### JWT Token Structure

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "CUSTOMER",
  "iat": 1651587600,
  "exp": 1651588500
}
```

### Frontend Integration

```typescript
// Axios interceptor for JWT handling
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,  // Include cookies in requests
});

// Interceptor for automatic token refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      await fetchRefresh();
      return axiosInstance.request(error.config);
    }
    return Promise.reject(error);
  }
);

// Context for auth state
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);

const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  setUser(response.data);
  setIsAuthenticated(true);
};

const logout = async () => {
  await axiosInstance.post('/auth/logout');
  setUser(null);
  setIsAuthenticated(false);
};
```

---

**Status**: Complete — Ready for implementation
