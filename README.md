# Factora / FactoryFlow - Fixed & Tested Build

This package contains the FactoryFlow backend (Spring Boot microservices) and
the Factora frontend (React + Vite), with the fixes and test suite described
below.

## What changed

### 1. Sequence generator (IDs start at 101)
Every entity across every service previously used `GenerationType.IDENTITY`
(plain DB auto-increment starting at 1). All 8 entities now use a dedicated
Postgres `SEQUENCE` per entity, `initialValue = 101`, `allocationSize = 1`, so
every new record's ID starts at 101 and increments by 1:

- `buyer-service`: `Buyer.buyerId`, `BuyerOrder.orderId`
- `dispatch-service`: `Dispatch.dispatchId`
- `production-service`: `ProductionOrder.productionOrderId`
- `inventry-service`: `Inventory.inventoryId`
- `auth-service`: `Role.roleId`, `User.userId`, `Vendor.vendorId`

Guarded by `EntityIdSequenceTest` in each service's test suite.

### 2. Missing User endpoints (real 404 bug)
`UserServiceController` never exposed `GET /user/{id}`, `PUT /user/update/{id}`,
`DELETE /user/delete/{id}` even though the service layer already implemented
`getUserById`/`updateUser`/`deleteUser`. The frontend's `userService.jsx`
calls all three. Fixed and covered by `UserServiceControllerTest`.

### 3. The buyer-order / dispatch workflow bug (the main reported issue)
The frontend's Buyer Order list used a manual status-progression map that
didn't match the backend's real state machine:

- Orders never start at `PENDING`/`CONFIRMED` - `BuyerOrderService.createOrder`
  always routes new orders straight to `IN_PRODUCTION` or
  `READY_FOR_DISPATCH` based on a live stock check.
- The old frontend let a user click "Move to DISPATCHED" directly from
  `IN_PRODUCTION`, and (after an earlier iteration) also let orders jump to
  `READY_FOR_DISPATCH` manually - both bypass the real Production/Dispatch
  services, so inventory and finished goods were never actually
  produced/deducted, causing later Dispatch calls to fail with "No
  finished-goods Inventory record found...".
- `READY_FOR_DISPATCH` was also missing from the Edit Order status dropdown
  and dashboard summary entirely.

Fixed by:
- Extracting the workflow rules into `src/pages/buyer/orderWorkflow.js`
  (single source of truth, unit tested in `orderWorkflow.test.js`).
- The only manual transition left is `DISPATCHED -> DELIVERED` (nothing else
  sets that automatically).
- Added a **"Start Production"** action on `IN_PRODUCTION` orders and a
  **"Create Dispatch"** action on `READY_FOR_DISPATCH` orders, both of which
  hand the order's data to the relevant Add form pre-filled (via router
  state) instead of forcing manual re-entry of vendor/buyer/product/quantity.
- Added the missing `READY_FOR_DISPATCH` badge color, Edit Order dropdown
  option (now generated from `ORDER_STATUSES`, so it can't drift out of sync
  again), and Buyer Dashboard summary bucket.

### 4. AuthFacadeImpl login bug (NullPointerException + leaked passwords + unhandled bad-credentials)
`AuthFacadeImpl.login()` already correctly implements the Facade pattern
(`IAuthFacade` in front of `UserDAO`, `AuthenticationManager`, `OTPService`)
and correctly keeps `login()` / `sendOTP()` / `verifyOTP()` as three
separate steps (an OTP can't be verified in the same call it was just sent
in - the user hasn't read it yet). But the implementation itself had three
real bugs:
- **NullPointerException on unknown email**: `userDAO.userLogin(email)`
  returns `null` when no user matches, but the very next line called
  `user.getPassword()` unconditionally - crashing with a raw, unhandled 500
  instead of a clean 401. Fixed with a null check that throws a new
  `AuthException` (handled by `GlobalExceptionHandler`, returns 401 with a
  clean message).
- **Wrong password also crashed with a raw 500**: `authenticationManager
  .authenticate(...)` throws `AuthenticationException` on bad credentials,
  which had no handler anywhere in auth-service. Now caught and translated
  into the same clean `AuthException`.
- **Plaintext + hashed passwords were logged to stdout** on every login
  attempt (`System.out.println("Entered Password: " + ...)`), and a
  `passwordEncoder.matches(...)` call was computed and logged but never
  actually used to gate anything (the real check was already
  `authenticationManager.authenticate(...)`). Both removed.

No frontend changes were needed for this one: `Login.jsx` already falls
back to a clean "Invalid Email or Password" message via `getErrorMessage`
regardless of what the backend returned, so this fix is a backend
correctness/security improvement (proper 401 instead of a raw 500, no
password leakage to logs) rather than a change to what the user sees.
Covered by `AuthFacadeImplTest`.

### 5. Single login() method (Facade collapsed to one entry point)
Per your follow-up request, the facade was collapsed from three methods
(`login`/`sendOTP`/`verifyOTP`) into one:

```
Client
  |
  | POST /auth/login   (email + password [+ otp])
  v
AuthController
  |
  v
AuthFacade.login()
  |--> UserDAO                  (look up the account)
  |--> AuthenticationManager     (verify the password)
  |--> OTPService.sendOTP()       (1st call: otp blank)
  |--> OTPService.verifyOTP()     (2nd call: otp filled in)
  |--> JwtUtil.generateToken()    (2nd call only)
  v
LoginResponse
```

There is now exactly **one** endpoint, `POST /auth/login`, posted twice by
the client with the same `AuthRequest` shape (`email`, `password`, and now
an optional `otp`):
1. `{ email, password }` -> credentials are checked, an OTP is emailed,
   response comes back `{ status: "OTP_SENT" }` with no token yet.
2. `{ email, password, otp }` -> credentials are checked again, the OTP is
   verified, `JwtUtil.generateToken()` is called directly by the facade
   (previously this happened inside `OTPService`), response comes back
   `{ status: "LOGIN_SUCCESS", token, userId, username, email, role,
   vendorId }`.

The two-call shape is kept (rather than one call with the OTP baked in)
because an OTP can't be verified in the same request that just sent it -
the user hasn't had a chance to read their email yet. `/auth/send-otp` and
`/auth/verify-otp` are gone; `LoginResponse` gained a `status` field
instead of overloading `token` to carry status text.

While rewriting `OTPService.verifyOTP`, its old raw, unhandled
`RuntimeException("Invalid OTP")` / `("OTP Expired")` (500s with no clean
message) were also converted to the same `AuthException` used by `login()`,
so every failure path in the whole login flow now returns a clean 401.
Also added a null check for `user.getVendor()`/`user.getRole()` in the
facade (an ADMIN account with no vendor would otherwise NPE on a
successful login).

**Frontend**: `authService.jsx` now exposes a single `login()` (no more
`sendOtp`/`verifyOtp`); `Login.jsx`'s existing two-screen UI (email+password
-> OTP entry) is unchanged for the user, it just now calls the same
`login()` twice instead of three different functions. Removed the unrouted,
now-stale `VerifyOtp.jsx` page that referenced the deleted `verifyOtp` call.
Covered by the rewritten `AuthFacadeImplTest` (7 cases) and new
`Login.test.jsx` (3 cases).

Every other frontend service file (`dispatchService`, `productionService`,
`inventoryService`, `vendorService`, `roleService`, `authService`) was
cross-checked against its actual Spring controller - all URL paths, HTTP
verbs, and DTO field names line up correctly. The Feign client wiring
between buyer-service <-> vendor/inventory, and dispatch-service <->
buyer-order/inventory/vendor, is internally consistent.

## Test suite

### Frontend (Vitest + React Testing Library) - runnable in this environment
```
cd frontend
npm install
npm test          # runs once
npm run test:watch
npm run build      # production build check
```
45 tests across 9 files, all passing: `sanitizePayload`, `apiError`,
`vendorScope`, `orderWorkflow` (regression guard for the core bug), plus
component tests for `OrderList`, `EditOrder`, `AddDispatch`, `AddProduction`,
and `Login` (the single-endpoint two-step OTP flow).

### Backend (JUnit 5 + Mockito) - written but NOT executed in this environment
```
cd backend/factora
mvn test
```
**Important limitation:** this sandbox has no network access to Maven
Central (only npm/PyPI-style registries are reachable), so `mvn test` could
not actually be run here. The test files were written and manually
cross-checked line-by-line against the real service/entity/DTO/repository
source (method signatures, field names, exception types) but have not been
compiler-verified. Please run `mvn test` locally before deploying and let me
know if anything doesn't compile.

Added `spring-boot-starter-test` (test scope) to `buyer-service`,
`dispatch-service`, `production-service`, `inventry-service`, and
`auth-service` poms to get JUnit 5 + Mockito + AssertJ.

New test files:
- `buyer-service`: `BuyerOrderServiceTest` (stock-based routing, DISPATCHED
  double-transition guard), `EntityIdSequenceTest`
- `dispatch-service`: `DispatchServiceTest` (guarded path into DISPATCHED,
  double-dispatch block, insufficient-stock block, inventory resolution),
  `EntityIdSequenceTest`
- `production-service`: `ProductionServiceTest` (raw-material reservation,
  finished-goods stock-in + READY_FOR_DISPATCH sync, FIFO buyer-order
  matching, completed-order immutability), `EntityIdSequenceTest`
- `inventry-service`: `EntityIdSequenceTest`
- `auth-service`: `EntityIdSequenceTest` (Role/User/Vendor),
  `UserServiceControllerTest` (the fixed endpoints)

## Running the app end-to-end
This sandbox also has no local Postgres and no Maven Central access, so full
end-to-end integration (all 6 services + Postgres + Eureka) could not be
smoke-tested here either. Locally:
1. Start Postgres and Eureka server.
2. `mvn clean install` from `backend/factora`, then start each service
   (`auth-service`, `inventry-service`, `production-service`,
   `dispatch-service`, `buyer-service`, `api-gateway`).
3. `cd frontend && npm install && npm run dev`.
4. Smoke test: create a buyer order -> confirm it lands in `IN_PRODUCTION`
   or `READY_FOR_DISPATCH` -> use "Start Production"/"Create Dispatch" from
   the order list -> confirm status advances automatically with inventory
   deducted/added correctly.
