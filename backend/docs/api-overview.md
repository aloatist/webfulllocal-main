# API Overview – Travel Platform Backend

This document outlines the first wave of REST endpoints built on NestJS. Each module lists the base route, CRUD actions, and payload contracts at a high level. Detailed DTO definitions will live aside TypeScript sources.

## Conventions

- Base URL: `https://{domain}/api`
- Timestamp format: ISO 8601 UTC
- Auth: JWT access token (`Authorization: Bearer <token>`)
- Pagination: `page`, `limit`, `sort`, `filter` query params with shared DTO
- Response wrapper: `{ data, meta? }` (meta used for pagination)

---

## Auth & Users

### Auth
- `POST /auth/login` – email/password → `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` – refresh token → new pair
- `POST /auth/logout` – revoke refresh token
- `POST /auth/request-reset` – send reset email/OTP
- `POST /auth/reset` – perform password reset

### Users
- `GET /users` – list users (requires `user.read`)
- `POST /users` – create staff user
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `PATCH /users/:id/status`

### Roles & Permissions
- `GET /roles`
- `POST /roles`
- `GET /roles/:id`
- `PATCH /roles/:id`
- `DELETE /roles/:id`
- `GET /permissions` – static list for UI

---

## Catalog Modules

### Locations
- `GET /locations` – tree/list filter by type
- `POST /locations`
- `GET /locations/:id`
- `PATCH /locations/:id`
- `DELETE /locations/:id`

### Tags
- `GET /tags`
- `POST /tags`
- `DELETE /tags/:id`

### Amenities
- `GET /amenities`
- `POST /amenities`
- `PATCH /amenities/:id`

### Media Library
- `GET /media`
- `POST /media` – multipart upload
- `DELETE /media/:id`

---

## Tours & Experiences

### Tour Packages
- `GET /tours`
- `POST /tours`
- `GET /tours/:id`
- `PATCH /tours/:id`
- `DELETE /tours/:id`
- `POST /tours/:id/publish`
- `GET /tours/:id/itinerary`
- `PUT /tours/:id/itinerary`
- `GET /tours/:id/pricing`
- `PUT /tours/:id/pricing`
- `POST /tours/:id/media`
- `DELETE /tours/:id/media/:mediaId`

### Experiences
- `GET /experiences`
- `POST /experiences`
- `GET /experiences/:id`
- `PATCH /experiences/:id`
- `DELETE /experiences/:id`
- `POST /experiences/:id/publish`

---

## Accommodations & Restaurants

### Accommodations
- `GET /accommodations`
- `POST /accommodations`
- `GET /accommodations/:id`
- `PATCH /accommodations/:id`
- `DELETE /accommodations/:id`
- `POST /accommodations/:id/publish`
- `GET /accommodations/:id/amenities`
- `PUT /accommodations/:id/amenities`

### Room Types
- `GET /accommodations/:id/rooms`
- `POST /accommodations/:id/rooms`
- `GET /room-types/:roomId`
- `PATCH /room-types/:roomId`
- `DELETE /room-types/:roomId`
- `GET /room-types/:roomId/rates`
- `PUT /room-types/:roomId/rates`
- `GET /room-types/:roomId/availability` (date range)
- `PUT /room-types/:roomId/availability`

### Restaurants & Menu
- `GET /restaurants`
- `POST /restaurants`
- `GET /restaurants/:id`
- `PATCH /restaurants/:id`
- `DELETE /restaurants/:id`
- `GET /restaurants/:id/menu`
- `PUT /restaurants/:id/menu`
- `GET /restaurants/:id/tables`
- `POST /restaurants/:id/tables`
- `PATCH /restaurant-tables/:tableId`
- `DELETE /restaurant-tables/:tableId`

---

## Commerce Modules

### Customers & Leads
- `GET /customers`
- `POST /customers`
- `GET /customers/:id`
- `PATCH /customers/:id`
- `GET /customers/:id/bookings`
- `GET /leads`
- `POST /leads`
- `PATCH /leads/:id`
- `POST /leads/:id/assign`
- `POST /leads/:id/convert`

### Bookings
- `GET /bookings`
- `POST /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id`
- `POST /bookings/:id/status`
- `GET /bookings/:id/items`
- `POST /bookings/:id/items`
- `PATCH /booking-items/:itemId`
- `DELETE /booking-items/:itemId`
- `GET /bookings/:id/timeline`

### Payments & Invoices
- `GET /bookings/:id/payments`
- `POST /bookings/:id/payments`
- `PATCH /payments/:paymentId`
- `GET /bookings/:id/invoices`
- `POST /bookings/:id/invoices`
- `POST /invoices/:invoiceId/send`

### Reservations
- `GET /reservations/restaurant`
- `POST /reservations/restaurant`
- `PATCH /reservations/restaurant/:id`
- `GET /reservations/experience`
- `POST /reservations/experience`
- `PATCH /reservations/experience/:id`

---

## Content & Marketing

### Articles & Pages
- `GET /articles`
- `POST /articles`
- `GET /articles/:id`
- `PATCH /articles/:id`
- `DELETE /articles/:id`
- `POST /articles/:id/publish`
- `GET /pages`
- `GET /pages/:key`
- `PUT /pages/:key`

### Home Layout & Banners
- `GET /home-layouts`
- `POST /home-layouts`
- `POST /home-layouts/:id/activate`
- `GET /banners`
- `POST /banners`
- `PATCH /banners/:id`
- `DELETE /banners/:id`

### Reviews
- `GET /reviews`
- `POST /reviews/:id/approve`
- `POST /reviews/:id/reject`
- `POST /reviews/:id/respond`

### Notifications
- `GET /notifications`
- `POST /notifications` (manual send)
- `GET /notification-templates`

---

## System & Settings

### Settings
- `GET /settings`
- `GET /settings/:key`
- `PUT /settings/:key`

### Audit Logs
- `GET /audit-logs` – filter by module, actor, date

### Webhooks
- `GET /webhooks`
- `POST /webhooks`
- `PATCH /webhooks/:id`
- `DELETE /webhooks/:id`
- `GET /webhooks/:id/logs`

---

## Public-Facing API Endpoints

These support the marketing website / mobile app.

- `GET /public/home` – returns active `home_layout`
- `GET /public/tours`
- `GET /public/tours/:slug`
- `GET /public/accommodations`
- `GET /public/accommodations/:slug`
- `GET /public/experiences`
- `GET /public/restaurants`
- `POST /public/bookings` – anonymous booking request → lead + pending booking
- `POST /public/leads` – contact form
- `POST /public/reviews` – new review submission (awaits moderation)

---

## Webhooks & Integrations

- `POST /webhooks/payment/:provider` – callback handlers
- `POST /webhooks/booking` – optional partner integration

---

## Roadmap Items

- GraphQL layer for high-traffic mobile usage (deferred)
- Realtime channel (socket.io) for ops dashboards
- Bulk import/export endpoints (CSV) for catalog modules

