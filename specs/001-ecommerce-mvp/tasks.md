---
description: "Task list for E-Commerce MVP Platform implementation"
---

# Tasks: E-Commerce MVP Platform

**Input**: Design documents from `specs/001-ecommerce-mvp/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included throughout (test-first for all business logic per Constitution Principle II)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency management, and basic structure

- [ ] T001 Create backend project structure: `backend/src/main/java/com/petstore/` with subdirectories (config, controller, service, repository, model, dto, exception, security, util)
- [ ] T002 [P] Create frontend project structure: `frontend/src/` with subdirectories (components, pages, services, hooks, context, styles, types, utils, tests, e2e)
- [ ] T003 [P] Initialize backend pom.xml with Maven dependencies (Spring Boot, JPA, PostgreSQL, Lombok, MapStruct, JUnit 5, Mockito, RestAssured)
- [ ] T004 [P] Initialize frontend package.json with Vite + React dependencies (Vite, React 18, React Router, Axios, TanStack Query, Tailwind CSS, MUI, React Hook Form, Zod, Vitest, Playwright)
- [ ] T005 [P] Configure Vite (vite.config.ts with React plugin, dev server on port 3000, HMR configuration)
- [ ] T006 [P] Configure Tailwind CSS in frontend (tailwind.config.ts, index.css with Tailwind directives, Vite postcss integration)
- [ ] T007 [P] Configure MUI theme in frontend (ThemeProvider, color scheme, typography)
- [ ] T008 [P] Create docker-compose.yml for local development (PostgreSQL, backend, frontend services)
- [ ] T009 Create Dockerfile for backend Spring Boot containerization
- [ ] T010 [P] Create Dockerfile for frontend React containerization
- [ ] T011 Create .env.example with all required environment variables (STRIPE_SECRET_KEY, JWT_SECRET, DATABASE_URL, etc.)
- [ ] T012 [P] Configure GitHub Actions CI/CD pipeline (.github/workflows/test.yml, .github/workflows/deploy.yml)

**Checkpoint**: Project structure initialized; Vite frontend configured and running on localhost:3000 with HMR; dependencies installed; Docker setup complete

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [ ] T013 Create Flyway migration V001__initial_schema.sql with all tables (User, Pet, CartItem, Order, OrderItem, Address, Transaction)
- [ ] T014 Add foreign key constraints and indexes to migration V001
- [ ] T015 Create Flyway migration V002__add_audit_columns.sql with created_at/updated_at triggers
- [ ] T016 [P] Configure Spring Data JPA entity mappings (User, Pet, CartItem, Order, OrderItem, Address, Transaction JPA entities)
- [ ] T017 [P] Create Spring Data repositories for each entity (UserRepository, PetRepository, CartItemRepository, OrderRepository, OrderItemRepository, AddressRepository, TransactionRepository)

### Authentication & Security

- [ ] T018 Implement JWT token provider (JwtTokenProvider class with token generation, validation, expiration)
- [ ] T019 Create JWT authentication filter (JwtAuthenticationFilter extends OncePerRequestFilter)
- [ ] T020 Configure Spring Security (SecurityFilterChain bean with JWT filter, CORS configuration, httpOnly cookie settings)
- [ ] T021 Implement password encoder (BCryptPasswordEncoder with factor 12)
- [ ] T022 Create custom authentication exception handler (InvalidTokenException, TokenExpiredException)
- [ ] T023 [P] Implement role-based access control (CUSTOMER, ADMIN roles via JWT claims)

### API Infrastructure

- [ ] T024 Create global exception handler (@ControllerAdvice, ErrorResponse DTO)
- [ ] T025 Implement request/response logging middleware
- [ ] T026 Create DTOs for all entities (UserDTO, PetDTO, CartItemDTO, OrderDTO, AddressDTO, TransactionDTO)
- [ ] T027 [P] Configure Jackson serialization (JSON date formatting, null handling)
- [ ] T028 Create API documentation structure (Swagger/OpenAPI comments ready for Phase 3+)
- [ ] T029 Setup API versioning (v1 prefix in all routes)

### Frontend Infrastructure

- [ ] T030 Create React Router configuration with route structure (/, /login, /signup, /catalog, /cart, /checkout, /orders, /admin, /order-confirmation)
- [ ] T031 Implement authentication context (AuthContext, useAuth hook, ProtectedRoute component)
- [ ] T032 Create Axios instance with base URL and interceptors (JWT token injection, refresh token logic)
- [ ] T033 [P] Implement cart context (CartContext, useCart hook for add/remove/clear operations)
- [ ] T034 Create error boundary component and error handling utilities
- [ ] T035 [P] Configure Vite environment variables loading (.env, .env.development, .env.production with VITE_ prefix)

### Base Components

- [ ] T036 [P] Create Layout component (header with navigation, footer with links)
- [ ] T037 [P] Create AppBar with Tailwind styling (logo, navigation links, auth status, cart badge)
- [ ] T038 [P] Create Footer component (links, company info, social media)
- [ ] T039 [P] Create common UI components (Button, Input, Select, Modal with MUI + Tailwind styling)
- [ ] T040 [P] Create loading spinner and error message components
- [ ] T041 [P] Create toast notification component (success, error, info messages)

### Tests Infrastructure

- [ ] T042 Setup JUnit 5 test configuration (pom.xml test dependencies, @SpringBootTest configuration)
- [ ] T043 Setup Testcontainers for PostgreSQL integration tests
- [ ] T044 [P] Setup Vitest + React Testing Library configuration (vitest.config.ts with Vite integration)
- [ ] T045 [P] Setup Playwright for E2E tests (playwright.config.ts, test fixtures, Vite dev server for testing)
- [ ] T046 Create test utilities and mocks (MockUser, MockPet, MockOrder factories)

**Checkpoint**: Foundation ready; backend + frontend can compile; database migrations runnable; authentication ready for user stories

---

## Phase 3: User Story 1 - Browse Pet Catalog & Discovery (Priority: P1) 🎯 MVP

**Goal**: Enable users to discover pets through multi-category filtering, searching, and sorting

**Independent Test**: Can be fully tested by loading catalog, applying filters/sorts, verifying results; no authentication or cart required

### Tests for User Story 1 (Test-First - Write BEFORE implementation)

- [ ] T047 [P] Unit test: PetService.getPets() with filters returns correct results (category, price range, age range)
- [ ] T048 [P] Unit test: PetService.searchPets() returns matching results by name/breed
- [ ] T049 [P] Unit test: PetService applies sorting (price_asc, price_desc, created_at_desc, age_asc, age_desc)
- [ ] T050 [P] Integration test: PetRepository query with composite index (category, status, price) executes <100ms
- [ ] T051 [P] Contract test: GET /api/v1/pets returns 200 with correct schema (X-Total-Count header, pagination object)
- [ ] T052 [P] Contract test: GET /api/v1/pets?category=DOG returns only dogs
- [ ] T053 [P] Contract test: GET /api/v1/pets?min_price=100&max_price=500 filters price range correctly
- [ ] T054 [P] Contract test: GET /api/v1/pets/:id returns 200 with pet details
- [ ] T055 [P] Contract test: GET /api/v1/pets/:id returns 404 for non-existent pet
- [ ] T056 [P] React component test: PetCard renders with image, name, breed, price, status
- [ ] T057 [P] React component test: PetCard "Add to Cart" button clickable and calls handler
- [ ] T058 [P] React component test: CatalogFilters apply category, price, age filters and update URL params
- [ ] T059 [P] React component test: PetCatalog displays lazy-loaded images; infinite scroll triggers fetch at bottom
- [ ] T060 [P] E2E test (Playwright): User navigates to catalog, sees pet listings, filters by category, verifies results

### Implementation for User Story 1

#### Backend

- [ ] T061 Implement PetController.getPets() endpoint (GET /api/v1/pets with query parameters)
- [ ] T062 Implement PetController.getPetById() endpoint (GET /api/v1/pets/:id)
- [ ] T063 Implement PetService.getPets() with filtering logic (category, price range, age range, search)
- [ ] T064 Implement PetService.searchPets() with full-text search on name/breed
- [ ] T065 Implement PetService.sortPets() with dynamic sorting (price, age, created_at)
- [ ] T066 Implement PetRepository custom query methods (@Query for complex filtering)
- [ ] T067 Implement pagination (Page<PetDTO> return type, default 20 items per page, max 100)
- [ ] T068 Create PetDTO for API responses (exclude internal fields like created_at)
- [ ] T069 Add API documentation comments (@ApiOperation, @ApiResponse in controller)
- [ ] T070 [P] Create PetMapper (MapStruct) to convert Pet entity → PetDTO

#### Frontend

- [ ] T071 Create PetCard component (Tailwind card styling with MUI Image, Typography, Button)
- [ ] T072 Create CatalogFilters component (category select, price range slider, age slider with Tailwind + MUI)
- [ ] T073 Create PetCatalog page (React Router page component, displays grid of PetCards)
- [ ] T074 Implement lazy image loading in PetCard (use next-gen image formats, responsive srcset)
- [ ] T075 Implement infinite scroll pagination (React Intersection Observer or library)
- [ ] T076 Implement search input with debounce (300ms delay before API call)
- [ ] T077 Integrate React Query useQuery() hook for catalog data fetching and caching
- [ ] T078 Create useCatalogFilters custom hook to manage filter state and URL sync
- [ ] T079 Implement loading state (skeleton screens for pet cards) and error handling
- [ ] T080 Create petService.ts API client (axios-based function to call GET /api/v1/pets)
- [ ] T081 [P] Implement responsive design (mobile: 1 column, tablet: 2 columns, desktop: 4 columns)

**Checkpoint**: Catalog page functional; users can browse pets with filters/sorts; images load efficiently

---

## Phase 4: User Story 2 - User Authentication & Account Management (Priority: P1)

**Goal**: Enable users to register, login, manage profiles, and save addresses

**Independent Test**: Can be fully tested with signup → login → view profile → logout; no catalog/cart required

### Tests for User Story 2 (Test-First)

- [ ] T082 [P] Unit test: UserService.registerUser() creates user with hashed password
- [ ] T083 [P] Unit test: UserService.registerUser() throws exception on duplicate email
- [ ] T084 [P] Unit test: UserService.authenticateUser() validates credentials correctly
- [ ] T085 [P] Unit test: UserService.authenticateUser() throws exception on invalid password
- [ ] T086 [P] Unit test: JwtTokenProvider generates valid token with correct claims (sub, email, role)
- [ ] T087 [P] Unit test: JwtTokenProvider validates token and extracts claims
- [ ] T088 [P] Unit test: JwtTokenProvider throws exception on expired token
- [ ] T089 [P] Contract test: POST /api/v1/auth/signup returns 201, creates user, sets JWT in cookie
- [ ] T090 [P] Contract test: POST /api/v1/auth/signup returns 409 on duplicate email
- [ ] T091 [P] Contract test: POST /api/v1/auth/login returns 200 and JWT token
- [ ] T092 [P] Contract test: POST /api/v1/auth/login returns 401 on invalid credentials
- [ ] T093 [P] Contract test: GET /api/v1/account/profile returns 401 without JWT
- [ ] T094 [P] Contract test: GET /api/v1/account/profile returns user details with JWT
- [ ] T095 [P] Contract test: POST /api/v1/address creates address and associates with user
- [ ] T096 [P] React component test: SignupForm validates email/password and submits correctly
- [ ] T097 [P] React component test: LoginForm validates credentials and handles errors
- [ ] T098 [P] React component test: ProfilePage displays user info and addresses
- [ ] T099 [P] E2E test (Playwright): User signs up → receives JWT → logs out → logs back in

### Implementation for User Story 2

#### Backend

- [ ] T100 Implement AuthController.signup() endpoint (POST /api/v1/auth/signup)
- [ ] T101 Implement AuthController.login() endpoint (POST /api/v1/auth/login)
- [ ] T102 Implement AuthController.logout() endpoint (POST /api/v1/auth/logout)
- [ ] T103 Implement AuthController.refresh() endpoint (POST /api/v1/auth/refresh)
- [ ] T104 Implement UserService.registerUser() with email validation and duplicate check
- [ ] T105 Implement UserService.authenticateUser() with password verification (bcrypt)
- [ ] T106 Create User JPA entity with bcrypted password field
- [ ] T107 Create UserDTO for API responses (exclude password, include role and created_at)
- [ ] T108 Implement AccountController.getProfile() endpoint (GET /api/v1/account/profile)
- [ ] T109 Implement AccountController.updateProfile() endpoint (PATCH /api/v1/account/profile)
- [ ] T110 Implement AddressController.createAddress() endpoint (POST /api/v1/address)
- [ ] T111 Implement AddressController.getAddresses() endpoint (GET /api/v1/address)
- [ ] T112 Implement AddressService with validation (street, city, state, zip format checks)
- [ ] T113 Create AddressDTO for API responses
- [ ] T114 [P] Implement UserMapper (MapStruct) for entity ↔ DTO conversion
- [ ] T115 [P] Implement token refresh mechanism with refresh token rotation

#### Frontend

- [ ] T116 Create SignupForm component (email, password, confirm password with validation via React Hook Form)
- [ ] T117 Create LoginForm component (email, password fields with error handling)
- [ ] T118 Create SignupPage layout (form + branding with Tailwind styling)
- [ ] T119 Create LoginPage layout (form + option to create account)
- [ ] T120 Implement useAuth hook to manage authentication state
- [ ] T121 Create ProtectedRoute component (redirects to login if not authenticated)
- [ ] T122 Create ProfilePage component (displays user info, saved addresses, edit form)
- [ ] T123 Create AddressForm component (name, street, city, state, zip with validation)
- [ ] T124 Create AuthService API client (signup, login, logout, refresh functions)
- [ ] T125 Implement JWT token storage in secure HTTP-only cookie (via axios withCredentials)
- [ ] T126 [P] Implement password validation (min 8 chars, UI feedback for requirements)
- [ ] T127 [P] Implement form error display (field-level errors from backend validation)
- [ ] T128 [P] Implement loading states (disable button during submission)
- [ ] T129 [P] Create navigation redirect logic (after login → catalog, after logout → login)

**Checkpoint**: Auth system fully functional; users can register, login, manage profiles

---

## Phase 5: User Story 3 - Shopping Cart & Multi-Step Checkout (Priority: P2)

**Goal**: Enable users to add items to cart, review, and complete multi-step checkout with payment

**Independent Test**: With authenticated users, can add pets to cart, proceed through checkout steps, place order

### Tests for User Story 3 (Test-First)

- [ ] T130 [P] Unit test: CartService.addToCart() creates CartItem or increments quantity
- [ ] T131 [P] Unit test: CartService.removeFromCart() deletes CartItem
- [ ] T132 [P] Unit test: CartService.calculateTotal() sums items correctly + tax
- [ ] T133 [P] Unit test: OrderService.createOrder() creates Order and OrderItems from cart
- [ ] T134 [P] Unit test: OrderService.createOrder() updates Pet status to SOLD
- [ ] T135 [P] Unit test: OrderService.createOrder() clears cart on success
- [ ] T136 [P] Unit test: OrderService.processPayment() creates Transaction record
- [ ] T137 [P] Contract test: POST /api/v1/cart adds pet and returns CartItem
- [ ] T138 [P] Contract test: GET /api/v1/cart returns user's cart with totals
- [ ] T139 [P] Contract test: DELETE /api/v1/cart/:itemId removes item
- [ ] T140 [P] Contract test: POST /api/v1/checkout/orders creates order with status PENDING_PAYMENT
- [ ] T141 [P] Contract test: POST /api/v1/checkout/payment processes payment via Stripe
- [ ] T142 [P] Contract test: POST /api/v1/checkout/payment returns 402 on payment decline
- [ ] T143 [P] Contract test: GET /api/v1/checkout/orders/:id returns order details
- [ ] T144 [P] React component test: CartItem displays pet info and remove button
- [ ] T145 [P] React component test: CartSummary displays total, tax, subtotal
- [ ] T146 [P] React component test: CheckoutWizard navigates through steps 1→2→3
- [ ] T147 [P] React component test: ShippingForm validates address fields
- [ ] T148 [P] React component test: BillingForm has "use shipping" checkbox option
- [ ] T149 [P] React component test: OrderReview displays items, addresses, totals
- [ ] T150 [P] React component test: StripePayment collects card and submits token
- [ ] T151 [P] E2E test (Playwright): Add pet to cart → proceed to checkout → fill forms → pay → order confirmation

### Implementation for User Story 3

#### Backend

- [ ] T152 Implement CartController.getCart() endpoint (GET /api/v1/cart)
- [ ] T153 Implement CartController.addToCart() endpoint (POST /api/v1/cart)
- [ ] T154 Implement CartController.removeFromCart() endpoint (DELETE /api/v1/cart/:itemId)
- [ ] T155 Implement CartService.getCart() to fetch all CartItems for user
- [ ] T156 Implement CartService.addToCart() with duplicate check (UNIQUE constraint on user_id, pet_id)
- [ ] T157 Implement CartService.removeFromCart() with authorization (verify ownership)
- [ ] T158 Implement CartService.calculateTotal() with subtotal, tax calculation
- [ ] T159 Implement CheckoutController.createOrder() endpoint (POST /api/v1/checkout/orders)
- [ ] T160 Implement CheckoutController.processPayment() endpoint (POST /api/v1/checkout/payment)
- [ ] T161 Implement OrderService.createOrder() with transaction handling (pessimistic locking on Pet status)
- [ ] T162 Implement OrderService.createOrder() to create OrderItems with snapshot data (pet_name_snapshot, unit_price)
- [ ] T163 Implement OrderService.processPayment() with Stripe SDK integration
- [ ] T164 Implement StripeService to handle payment intent creation and token verification
- [ ] T165 Implement payment retry logic with exponential backoff
- [ ] T166 Create CartItemDTO, OrderDTO, OrderItemDTO for API responses
- [ ] T167 Implement transaction rollback on payment failure (cart preserved, order status PAYMENT_FAILED)
- [ ] T168 [P] Implement email notification on successful order (send confirmation email via SendGrid/SES)
- [ ] T169 [P] Implement Stripe webhook handler for payment confirmation (POST /api/v1/webhooks/stripe)

#### Frontend

- [ ] T170 Create CartPage component (list of CartItems with remove buttons, total, "Proceed to Checkout" button)
- [ ] T171 Create CartItem component (pet image, name, breed, price, remove button with Tailwind styling)
- [ ] T172 Create CartSummary component (subtotal, tax, total with MUI typography)
- [ ] T173 Create CheckoutPage with Stepper component (4 steps: Shipping → Billing → Review → Confirmation)
- [ ] T174 Create ShippingForm component (fields: full_name, street, city, state, zip with Tailwind Input + MUI)
- [ ] T175 Create BillingForm component (same fields + "use shipping" checkbox)
- [ ] T176 Create OrderReviewStep component (displays cart items, addresses, totals, "Place Order" button)
- [ ] T177 Create StripePayment component (integrates Stripe.js CardElement, handles payment submission)
- [ ] T178 Create OrderConfirmation page (displays order number, items, delivery estimate, thank you message)
- [ ] T179 Implement useCart hook to manage cart state (add, remove, clear, total)
- [ ] T180 Implement CheckoutStepper state management (current step, form data across steps)
- [ ] T181 Create cartService.ts API client (getCart, addToCart, removeFromCart)
- [ ] T182 Create checkoutService.ts API client (createOrder, processPayment)
- [ ] T183 [P] Implement form validation with React Hook Form + Zod (address fields validation)
- [ ] T184 [P] Implement error toast on checkout failure; preserve cart for retry
- [ ] T185 [P] Implement success confirmation with email receipt link
- [ ] T186 [P] Implement loading states during payment processing (disable button, show spinner)

**Checkpoint**: Users can add items to cart, complete checkout, process payment successfully

---

## Phase 6: User Story 4 - Order History & Status Dashboard (Priority: P2)

**Goal**: Enable users to view past orders and real-time fulfillment status

**Independent Test**: Users can view order history, click order to see details, see status updates

### Tests for User Story 4 (Test-First)

- [ ] T187 [P] Unit test: OrderService.getUserOrders() returns paginated orders for user
- [ ] T188 [P] Unit test: OrderService.getOrderById() returns order details with items and addresses
- [ ] T189 [P] Contract test: GET /api/v1/orders returns user's orders paginated
- [ ] T190 [P] Contract test: GET /api/v1/orders?status=SHIPPED filters by status
- [ ] T191 [P] Contract test: GET /api/v1/orders/:id returns 403 if user doesn't own order
- [ ] T192 [P] React component test: OrderHistory displays list of orders with order number, date, total, status
- [ ] T193 [P] React component test: OrderDetail displays items, addresses, payment info, fulfillment status
- [ ] T194 [P] React component test: OrderStatusTimeline shows PROCESSING → SHIPPED → DELIVERED states
- [ ] T195 [P] E2E test (Playwright): User views order history, clicks order, sees details and status

### Implementation for User Story 4

#### Backend

- [ ] T196 Implement OrderController.getUserOrders() endpoint (GET /api/v1/orders with pagination)
- [ ] T197 Implement OrderController.getOrderById() endpoint (GET /api/v1/orders/:id)
- [ ] T198 Implement OrderService.getUserOrders() with authorization check (user_id matches authenticated user)
- [ ] T199 Implement OrderService.getOrderById() with authorization check
- [ ] T200 Create OrderDTO with nested items and address details
- [ ] T201 [P] Implement OrderStatus polling endpoint for real-time updates (WebSocket optional for future)

#### Frontend

- [ ] T202 Create OrdersPage component (displays list of user's orders with MUI DataGrid or custom table)
- [ ] T203 Create OrderHistory component (order list with columns: Order #, Date, Total, Status)
- [ ] T204 Create OrderDetailPage component (displays order items, addresses, totals, status timeline)
- [ ] T205 Create OrderStatusTimeline component (visual timeline: Processing → Shipped → Delivered with dates)
- [ ] T206 Implement useOrders custom hook (fetch orders list, poll for status updates)
- [ ] T207 Create orderService.ts API client (getOrders, getOrderById)
- [ ] T208 [P] Implement order status polling (30-second intervals to refresh status)
- [ ] T209 [P] Implement responsive design (mobile: stacked layout, desktop: side-by-side)

**Checkpoint**: Users can view complete order history and track deliveries

---

## Phase 7: User Story 5 - Admin Inventory & Product Management (Priority: P2)

**Goal**: Enable admins to add, update, remove pet listings and manage inventory

**Independent Test**: Admin can login, access inventory page, add new pet, update price, mark as sold

### Tests for User Story 5 (Test-First)

- [ ] T210 [P] Unit test: AdminPetService.createPet() creates pet with valid input
- [ ] T211 [P] Unit test: AdminPetService.updatePet() updates fields correctly
- [ ] T212 [P] Unit test: AdminPetService.deletePet() soft-deletes pet (status = DELETED or hidden)
- [ ] T213 [P] Unit test: AdminPetService.listInventory() returns all pets with counts
- [ ] T214 [P] Contract test: POST /api/v1/admin/pets returns 403 if user not admin
- [ ] T215 [P] Contract test: POST /api/v1/admin/pets creates pet and returns 201
- [ ] T216 [P] Contract test: PATCH /api/v1/admin/pets/:id updates pet fields
- [ ] T217 [P] Contract test: DELETE /api/v1/admin/pets/:id deletes pet
- [ ] T218 [P] React component test: AdminInventory displays all pets in DataGrid
- [ ] T219 [P] React component test: CreatePetForm collects category, name, breed, age, price, description, images
- [ ] T220 [P] React component test: EditPetModal allows updating pet details
- [ ] T221 [P] E2E test (Playwright): Admin adds new pet, verifies in catalog, updates price, marks sold

### Implementation for User Story 5

#### Backend

- [ ] T222 Implement AdminController.createPet() endpoint (POST /api/v1/admin/pets) with @PreAuthorize("hasRole('ADMIN')")
- [ ] T223 Implement AdminController.updatePet() endpoint (PATCH /api/v1/admin/pets/:id)
- [ ] T224 Implement AdminController.deletePet() endpoint (DELETE /api/v1/admin/pets/:id)
- [ ] T225 Implement AdminController.listInventory() endpoint (GET /api/v1/admin/pets with admin-only details)
- [ ] T226 Implement AdminPetService.createPet() with image upload to cloud storage (AWS S3 or CDN)
- [ ] T227 Implement AdminPetService.updatePet() with field-level validation
- [ ] T228 Implement AdminPetService.deletePet() (soft delete by setting status or hard delete)
- [ ] T229 Implement image upload handler (multipart, convert to WebP, upload to cloud, return URLs)
- [ ] T230 [P] Implement AdminOrderController.listOrders() endpoint (GET /api/v1/admin/orders) for fulfillment
- [ ] T231 [P] Implement AdminOrderController.updateOrderStatus() endpoint (PATCH /api/v1/admin/orders/:id) to update PROCESSING → SHIPPED → DELIVERED
- [ ] T232 [P] Implement email notification on status change (send to customer)

#### Frontend

- [ ] T233 Create AdminPage layout (navigation to Inventory, Orders sections)
- [ ] T234 Create InventoryPage component (displays all pets in MUI DataGrid with columns: ID, Name, Category, Price, Status, Actions)
- [ ] T235 Create CreatePetForm component (form with fields: category dropdown, name, breed, age, price, description textarea, image upload)
- [ ] T236 Create EditPetModal component (pre-populated form to update pet details)
- [ ] T237 Implement image upload in form (preview before upload, validate file size/type)
- [ ] T238 Implement bulk actions (select multiple pets, mark as sold, delete)
- [ ] T239 Create AdminOrdersPage component (DataGrid of all orders with status, customer, total)
- [ ] T240 Create OrderFulfillmentPanel component (quick status update buttons: Mark as Shipped, Mark as Delivered)
- [ ] T241 Create adminService.ts API client (createPet, updatePet, deletePet, listOrders, updateOrderStatus)
- [ ] T242 [P] Implement optimistic UI updates (local state updates before API confirmation)
- [ ] T243 [P] Implement undo/retry on failed admin operations

**Checkpoint**: Admin inventory management fully functional; order fulfillment tracking working

---

## Phase 8: Integration & Polish

**Purpose**: Cross-cutting concerns, performance optimization, documentation

- [ ] T244 [P] Implement global error handling (500 errors logged, user-friendly messages)
- [ ] T245 [P] Implement request logging middleware (method, path, status, duration)
- [ ] T246 [P] Implement rate limiting on auth endpoints (login: 10/min, signup: 5/min per IP)
- [ ] T247 [P] Setup Spring Boot Actuator for health checks and metrics
- [ ] T248 Implement database connection pooling optimization (HikariCP tuning)
- [ ] T249 [P] Optimize database queries (verify all use indexes, check N+1 queries)
- [ ] T250 [P] Implement caching layer (Redis for pet catalog if volume grows beyond 5k)
- [ ] T251 [P] Optimize frontend bundle size (code splitting, tree-shaking, lazy loading)
- [ ] T252 [P] Implement service worker for offline capability (optional for MVP)
- [ ] T253 [P] Setup Sentry error tracking for production monitoring
- [ ] T254 [P] Configure Content Security Policy (CSP) headers
- [ ] T255 [P] Implement CORS whitelist (restrict to allowed domains)
- [ ] T256 Finalize OpenAPI/Swagger documentation for all endpoints
- [ ] T257 Create deployment documentation (Render configuration, environment setup)
- [ ] T258 [P] Setup database backup strategy (Render-managed or manual)

**Checkpoint**: Production-ready infrastructure, comprehensive monitoring, fully documented

---

## Phase 9: Testing & Validation

**Purpose**: Comprehensive test execution and performance validation

- [ ] T259 Run backend unit tests (JUnit 5): `mvn test` - target 80% coverage on service layer
- [ ] T260 Run backend integration tests (Testcontainers): `mvn verify` - verify all DB operations
- [ ] T261 Run backend contract tests (RestAssured): Validate all API endpoints match OpenAPI spec
- [ ] T262 Run frontend unit tests (Vitest): `npm run test` - target 70% coverage on components
- [ ] T263 Run frontend component tests (React Testing Library): Verify user interactions
- [ ] T264 Run E2E tests (Playwright): `npm run e2e` - critical user journeys
- [ ] T265 Load testing: Verify <200ms p95 API latency at 1,000 concurrent users (via k6 or JMeter)
- [ ] T266 [P] Performance audit: Frontend bundle size, image optimization, Core Web Vitals
- [ ] T267 Security audit: OWASP Top 10 check, SQL injection prevention, XSS prevention
- [ ] T268 [P] Accessibility audit: WCAG 2.1 AA compliance for UI components
- [ ] T269 Database migration testing: Verify all migrations are reversible and idempotent

**Checkpoint**: All test suites passing; performance metrics meet targets; zero high-severity security issues

---

## Phase 10: Deployment & Go-Live

**Purpose**: Deploy to production on Render and validate

- [ ] T270 Create Render environment (backend service, frontend service, PostgreSQL)
- [ ] T271 Configure environment variables in Render (STRIPE_SECRET_KEY, JWT_SECRET, DATABASE_URL)
- [ ] T272 Deploy backend to Render: `git push` triggers CI/CD pipeline
- [ ] T273 Deploy frontend to Render: `git push` triggers CI/CD pipeline
- [ ] T274 Verify database migrations run on deploy (Flyway auto-migration)
- [ ] T275 Smoke tests on production (verify catalog loads, signup works, order flow functional)
- [ ] T276 Monitor initial traffic (error rates, latency, resource usage)
- [ ] T277 [P] Setup automated daily backups of production database
- [ ] T278 [P] Create runbook for common incidents (database down, payment API down, deployment rollback)

**Checkpoint**: Production live; users can browse, purchase, and track orders; infrastructure monitored

---

## Summary

**Total Tasks**: 276 (broken into actionable 1-2 hour tasks)  
**Estimated Timeline**: 4-6 weeks for team of 2-3 developers  
**Critical Path**: Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3&4 (P1 Stories) → Phase 5&6&7 (P2 Stories) → Phase 8&9 (Polish & Testing) → Phase 10 (Deploy)

**Parallel Execution**: All [P] marked tasks can run simultaneously once dependencies are met

**Test-First Compliance**: All business logic phases include test tasks completed BEFORE implementation, per Constitution Principle II

---

**Version**: 1.0.0 | **Created**: 2026-05-01 | **Status**: Ready for implementation
