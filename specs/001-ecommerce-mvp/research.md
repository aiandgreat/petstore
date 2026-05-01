# Research: Technical Decisions & Constraints

**Feature**: E-Commerce MVP Platform  
**Date**: 2026-05-01  
**Phase**: 0 - Pre-Implementation Research

## Technology Stack Rationale

### Backend: Java Spring Boot 3.2

**Decision**: Use Java 17 with Spring Boot 3.2 for REST API backend

**Rationale**:
- Spring Boot provides battle-tested ecosystem: Spring Security for JWT auth, Spring Data JPA for database access, Spring Web for REST
- Java ecosystem mature for payment processing integrations (Stripe, PayPal SDKs stable)
- Strong typing (vs. Node.js) catches errors at compile-time; reduces production bugs
- PostgreSQL driver stable; transaction support critical for payment integrity
- Spring profiles enable dev/test/prod configuration management
- Scalability proven at high-throughput e-commerce scale (Shopify, eBay run on JVM languages)

**Alternatives Considered**:
- Node.js + Express: Faster dev cycle, but weaker typing leads to more runtime errors in payment critical path
- Python + Django: Good ORM, but GIL limits concurrent request handling
- .NET Core: Viable alternative but less familiarity in team; higher learning curve

### Frontend: React 18 with TypeScript and Vite

**Decision**: React SPA with TypeScript, Vite build tool, Tailwind CSS, Material-UI (MUI)

**Rationale**:
- **Vite**: Lightning-fast build tool with instant dev server startup (<100ms), native ESM, HMR for rapid development
- React ecosystem best-in-class for interactive catalog UI with filtering/sorting
- TypeScript catches type errors at build; improves IDE support for component props
- Tailwind CSS enables rapid styling without CSS-in-JS build overhead
- Material-UI provides accessible, pre-built components (forms, dialogs, data tables) reducing dev time
- React Query (TanStack Query) handles API caching and state management elegantly
- Component reusability across catalog, cart, checkout, admin pages
- Large dev community; easy to hire for

**Alternatives Considered**:
- Vue.js: Smaller community; fewer component libraries mature for e-commerce
- Angular: Heavier framework; steeper learning curve; overkill for MVP
- Next.js: Over-engineered for SPA; adds complexity without MVP benefits; Vite provides superior dev experience for SPA
- Create React App: Slower build times; Vite offers 10x faster development iteration

### Database: PostgreSQL 18

**Decision**: PostgreSQL 18 for relational data (users, pets, orders, inventory)

**Rationale**:
- ACID transactions mandatory for payment/order integrity; PostgreSQL guarantees Serializability
- Foreign keys and constraints prevent invalid states (orphaned orders, negative inventory)
- JSON support useful for storing product attributes (tags, characteristics)
- JSONB indexes for fast filtering on pet attributes (breed, age, color combinations)
- Render-managed PostgreSQL reduces ops burden; automatic backups and failover
- Connection pooling (pgbouncer) enables horizontal scaling to 1000s of concurrent users

**Alternatives Considered**:
- MongoDB: Eventual consistency risky for payment data; denormalization makes inventory tracking error-prone
- MySQL: Viable but PostgreSQL's JSONB and window functions superior for complex queries
- Firebase/DynamoDB: Vendor lock-in; payment transaction guarantees weaker; higher cost at scale

### Authentication: JWT Tokens

**Decision**: JWT stateless authentication with refresh tokens

**Rationale**:
- Stateless enables horizontal scaling; no session store required
- JWT claims can embed role (customer/admin) reducing auth lookups
- HTTPS + HttpOnly cookies for token storage prevent XSS token theft
- Refresh token rotation enables token revocation without database lookup
- OAuth2/OpenID integration possible later without architecture change

**Alternatives Considered**:
- Session cookies: Requires sticky load balancer or distributed session store (Redis); adds complexity
- OAuth2 (external IDP): Out of scope for MVP; requires third-party maintenance
- API keys: Suitable for backend-to-backend; not for user-facing web app

### Payment Processing: Stripe/PayPal

**Decision**: Integrate Stripe or PayPal for payment processing; zero payment data storage locally

**Rationale**:
- PCI compliance outsourced; eliminates audit burden and liability
- Stripe/PayPal SDKs handle card validation, encryption, fraud detection
- Webhooks enable async order confirmation and fulfillment triggering
- Customer payment methods stored in Stripe vault; no local card data
- Retry mechanisms for failed payments built into provider

**Alternatives Considered**:
- Custom payment handler: Would require PCI-DSS certification (100k+ USD annually); not justified for MVP
- Square/Adyen: Viable alternatives; Stripe chosen for ecosystem maturity

### Deployment: Render

**Decision**: Containerize with Docker; deploy to Render for managed infrastructure

**Rationale**:
- Render provides PostgreSQL, backend, and frontend hosting in single platform
- Auto-scaling handles load spikes without manual intervention
- Git-based deployments reduce manual steps; CI/CD integrated
- Environment variables for secrets management (API keys, database URLs)
- Global CDN for static assets (frontend)
- SSL certificates auto-provisioned

**Alternatives Considered**:
- AWS ECS + RDS: More control but higher ops burden; overkill for MVP
- Heroku: Simpler than AWS but higher cost; Render pricing more favorable
- Self-hosted VPS: Requires DevOps expertise; not suitable for small team

## API Design Patterns

### RESTful Endpoints

**Decision**: REST API with JSON payloads; OpenAPI 3.0 specification

**Endpoint Structure**:
```
GET    /api/v1/pets              - List pets with filters
GET    /api/v1/pets/:id          - Get pet details
POST   /api/v1/auth/signup       - Register account
POST   /api/v1/auth/login        - Login and receive JWT
POST   /api/v1/cart              - Add item to cart
GET    /api/v1/cart              - Get current cart
DELETE /api/v1/cart/:itemId      - Remove cart item
POST   /api/v1/checkout/orders   - Place order
GET    /api/v1/orders            - List user's orders
GET    /api/v1/orders/:id        - Get order details
POST   /api/v1/admin/pets        - Create pet listing (admin only)
PATCH  /api/v1/admin/pets/:id    - Update pet (admin only)
DELETE /api/v1/admin/pets/:id    - Remove pet (admin only)
```

**Versioning**: Semantic versioning; v1 prefix in URL; breaking changes trigger v2 endpoint

**Error Handling**: Consistent error response format:
```json
{
  "error": "INVALID_REQUEST",
  "message": "Email already registered",
  "status": 400,
  "timestamp": "2026-05-01T12:00:00Z"
}
```

## Database Design Principles

### Normalization & Denormalization Balance

- **Normalize**: User data (email), address data to prevent duplication
- **Denormalize**: Store pet name + price in OrderItem (snapshot at purchase time, not subject to future price changes)

### Constraints & Integrity

- Foreign key constraints enforce referential integrity (no orphaned orders)
- Check constraints validate invariants (price > 0, age >= 0)
- Unique constraints prevent duplicate emails, duplicate cart items per user
- Triggers auto-update `updated_at` timestamps

### Indexing Strategy

- Primary: user_id, pet_id (foreign key performance)
- Catalog filtering: (category, price_range, age_range) composite index for quick catalog queries
- Search: Full-text index on pet.name and pet.breed for fast text search
- Covering index on orders(user_id, created_at, status) for order history queries

## Testing Strategy

### Backend

**Unit Tests** (JUnit 5 + Mockito):
- Service layer: Auth validation, cart calculations, inventory checks
- DTOs: Serialization/deserialization round-trip
- Utilities: Date handling, price calculations

**Integration Tests** (Testcontainers):
- Repository layer: Database queries with real PostgreSQL (via container)
- Service + Repository: End-to-end domain logic (e.g., place order → inventory decrements)

**Contract Tests** (RestAssured):
- All API endpoints: Request/response payloads match OpenAPI spec
- Auth flows: JWT token creation, validation, expiration
- Error scenarios: Invalid input, unauthorized access

**Target Coverage**: 80% of service layer, 50% of controller layer

### Frontend

**Unit Tests** (Vitest + React Testing Library):
- Components: Render with various props, user interactions trigger correct callbacks
- Hooks: useCart, useAuth state management and lifecycle
- Utilities: Price formatting, date parsing

**Component Tests**:
- Catalog page: Filters apply correctly, search updates results, lazy-load triggers
- Checkout wizard: Multi-step navigation, validation, summary accuracy
- Auth forms: Email/password validation, error display

**E2E Tests** (Playwright):
- Critical path: Browse → Add to cart → Checkout → Order confirmation
- Auth flow: Signup → Login → Logout
- Admin flow: Create pet → Verify in catalog

**Target Coverage**: 70% of critical user journeys

## Security Considerations

### Authentication & Authorization

- JWT tokens: 15-minute expiration; refresh tokens: 7-day expiration
- HttpOnly cookies prevent JavaScript access to tokens
- Role-based access control via JWT claims: customer vs. admin
- Password: bcrypt with salt factor 12; minimum 8 characters enforced

### Data Protection

- Passwords: bcrypted before storage
- Sensitive fields: email, addresses encrypted at-rest using AES-256 (via Spring Data encryption)
- API keys, database URLs: Environment variables in Render, never in code
- HTTPS enforced; no HTTP fallback

### Payment Security

- Payment tokens from Stripe/PayPal never logged
- Card data never touches application; handled entirely by provider
- Audit log records payment events (timestamp, amount, user_id, success/failure)

## Performance Optimization

### Backend

- Connection pooling: HikariCP with 20 connections per pod
- Query optimization: N+1 prevention via JOIN FETCH in JPA queries
- Database indexing: Composite indexes on frequently-filtered columns
- Caching: Spring Cache (Redis in production) for pet catalog reads

### Frontend

- Code splitting: Route-based; lazy-load admin pages, order history
- Image optimization: WebP format with fallback; responsive srcset
- React memoization: PetCard, PriceDisplay memoized to prevent re-renders
- React Query: Caching reduces API calls; background refetch for cart updates

## Error Handling & Observability

### Logging

- Spring: INFO level for all API requests (method, path, status, duration)
- Errors: ERROR level with stack trace for exceptions
- Payment: Audit log for all payment transactions (success/failure)
- Sensitive data filtering: Passwords, tokens redacted from logs

### Monitoring

- Render metrics: CPU, memory, request count, error rate
- Custom metrics: API latency by endpoint, payment success rate
- Alerts: Error rate > 5%, payment failure > 10%

### Error Recovery

- Payment failures: Retry with exponential backoff; user notified; cart preserved
- Database failures: Connection pool failover; graceful error response to client
- Deployment failures: Automatic rollback if health checks fail

---

**Next**: Review research findings with team; proceed to data-model definition
