# Travel Platform Backend – Entity Relationship Design

This document captures the initial data model for the tourism platform (tours, hospitality, restaurant, homestay) together with cross-cutting concerns such as authentication, bookings, payments, media and CMS. It is intended to guide the implementation of TypeORM entities and API contracts.

## Legend

- **PK**: Primary key
- **FK**: Foreign key
- **UQ**: Unique constraint
- `[]`: array/JSON
- All timestamps follow the `created_at`, `updated_at` convention (UTC). Soft delete handled with `deleted_at` when applicable.

## Core Security & Identity

### `users`
- **PK** `id` (uuid)
- `email` (varchar, UQ)
- `password_hash` (varchar)
- `full_name` (varchar)
- `avatar_id` (nullable FK → media_assets)
- `status` (`active | pending | suspended`)
- `last_login_at` (timestamp)
- `metadata` (jsonb)

### `roles`
- **PK** `id` (uuid)
- `code` (varchar, UQ)
- `name` (varchar)
- `description` (text)

### `permissions`
- **PK** `id` (uuid)
- `code` (varchar, UQ)
- `name` (varchar)
- `description` (text)

### `role_permissions`
- **PK** `id` (uuid)
- `role_id` (FK → roles)
- `permission_id` (FK → permissions)

### `user_roles`
- **PK** `id` (uuid)
- `user_id` (FK → users)
- `role_id` (FK → roles)

### `auth_tokens`
- **PK** `id` (uuid)
- `user_id` (FK → users)
- `refresh_token_hash` (varchar)
- `expires_at` (timestamp)
- `user_agent` (varchar)
- `ip` (varchar)

### `audit_logs`
- **PK** `id` (uuid)
- `actor_id` (FK → users, nullable for system actions)
- `module` (varchar)
- `action` (varchar)
- `entity_type` (varchar)
- `entity_id` (uuid/varchar)
- `metadata` (jsonb)
- `created_at`

---

## Shared Catalog

### `media_assets`
- **PK** `id` (uuid)
- `url` (varchar)
- `provider` (`local | s3 | cloudinary | gcs`)
- `mime_type` (varchar)
- `width` (int)
- `height` (int)
- `size_bytes` (int)
- `alt_text` (varchar)
- `tags` (text[])
- `created_by` (FK → users)

### `tags`
- **PK** `id` (uuid)
- `slug` (varchar, UQ)
- `label` (varchar)
- `type` (`destination | accommodation | experience | article | generic`)

### `locations`
- **PK** `id` (uuid)
- `name` (varchar)
- `slug` (varchar, UQ)
- `type` (`province | city | district | attraction`)
- `parent_id` (nullable self FK)
- `latitude` (numeric)
- `longitude` (numeric)
- `metadata` (jsonb)

### `amenities`
- **PK** `id` (uuid)
- `code` (varchar, UQ)
- `name` (varchar)
- `category` (`room | property | dining | experience | transportation`)
- `icon` (varchar)

---

## Products & Inventory

### `tour_packages`
- **PK** `id` (uuid)
- `code` (varchar, UQ)
- `name` (varchar)
- `slug` (varchar, UQ)
- `summary` (text)
- `description` (jsonb rich text)
- `duration_days` (int)
- `rating_average` (numeric)
- `status` (`draft | published | archived`)
- `default_currency` (varchar)
- `cover_image_id` (FK → media_assets)
- `location_id` (FK → locations primary attraction)
- `tags` (uuid[] FK → tags)

### `tour_itineraries`
- **PK** `id` (uuid)
- `tour_package_id` (FK → tour_packages)
- `day_number` (int)
- `title` (varchar)
- `description` (jsonb)
- `activities` (jsonb)

### `tour_pricing`
- **PK** `id` (uuid)
- `tour_package_id` (FK → tour_packages)
- `customer_type` (`adult | child | infant | private_group`)
- `currency` (varchar)
- `price` (numeric)
- `start_date` (date)
- `end_date` (date)
- `min_group_size` (int)
- `max_group_size` (int)

### `tour_media`
- **PK** `id` (uuid)
- `tour_package_id` (FK → tour_packages)
- `media_id` (FK → media_assets)
- `position` (int)

### `experiences`
- **PK** `id` (uuid)
- `code`, `name`, `slug`, `summary`, `description`, `status` similar to tours
- `base_price` (numeric)
- `currency` (varchar)
- `duration_minutes` (int)
- `location_id` (FK → locations)

### `accommodations`
- **PK** `id` (uuid)
- `code` (varchar, UQ)
- `name` (varchar)
- `slug` (varchar, UQ)
- `type` (`hotel | resort | homestay | villa`)
- `description` (jsonb)
- `address` (varchar)
- `location_id` (FK → locations)
- `star_rating` (numeric)
- `contact_phone` (varchar)
- `contact_email` (varchar)
- `check_in_time` (time)
- `check_out_time` (time)
- `status` (`draft | published | suspended`)
- `cover_image_id` (FK → media_assets)

### `accommodation_amenities`
- **PK** `id`
- `accommodation_id` (FK → accommodations)
- `amenity_id` (FK → amenities)

### `room_types`
- **PK** `id` (uuid)
- `accommodation_id` (FK → accommodations)
- `code` (varchar)
- `name` (varchar)
- `slug` (varchar)
- `description` (jsonb)
- `max_adults` (int)
- `max_children` (int)
- `default_capacity` (int)
- `size_sqm` (numeric)
- `base_price` (numeric)
- `currency` (varchar)
- `status` (`active | inactive`)

### `room_type_amenities`
- **PK** `id`
- `room_type_id` (FK → room_types)
- `amenity_id` (FK → amenities)

### `room_rates`
- **PK** `id` (uuid)
- `room_type_id` (FK → room_types)
- `rate_plan` (varchar) — e.g. `rack`, `weekend`, `holiday`
- `currency` (varchar)
- `price` (numeric)
- `valid_from` (date)
- `valid_to` (date)
- `cancellation_policy` (jsonb)

### `room_availability`
- **PK** `id` (uuid)
- `room_type_id` (FK → room_types)
- `date` (date)
- `total_rooms` (int)
- `booked_rooms` (int)

### `restaurant_profiles`
- **PK** `id` (uuid)
- `accommodation_id` (nullable FK → accommodations)
- `name` (varchar)
- `slug` (varchar)
- `description` (jsonb)
- `cuisine_types` (text[])
- `opening_hours` (jsonb)
- `contact_phone` (varchar)
- `status` (`draft | published | suspended`)

### `menu_categories`
- **PK** `id` (uuid)
- `restaurant_id` (FK → restaurant_profiles)
- `name` (varchar)
- `description` (text)
- `position` (int)

### `menu_items`
- **PK** `id` (uuid)
- `category_id` (FK → menu_categories)
- `name` (varchar)
- `description` (text)
- `price` (numeric)
- `currency` (varchar)
- `is_vegetarian` (bool)
- `is_signature` (bool)
- `status` (`available | unavailable`)

### `restaurant_tables`
- **PK** `id` (uuid)
- `restaurant_id` (FK → restaurant_profiles)
- `code` (varchar)
- `seats` (int)
- `location` (varchar)
- `status` (`available | maintenance`)

---

## Commerce

### `customers`
- **PK** `id` (uuid)
- `full_name` (varchar)
- `email` (varchar)
- `phone` (varchar)
- `country` (varchar)
- `preferred_language` (varchar)
- `notes` (text)
- `source` (`web_form | phone | partner | walk_in`)
- `tags` (text[])

### `leads`
- **PK** `id` (uuid)
- `customer_id` (nullable FK → customers)
- `name` (varchar)
- `email` (varchar)
- `phone` (varchar)
- `message` (text)
- `topic` (`tour | accommodation | restaurant | general`)
- `assigned_to` (FK → users)
- `status` (`new | contacted | qualified | converted | lost`)

### `bookings`
- **PK** `id` (uuid)
- `code` (varchar, UQ)
- `customer_id` (FK → customers)
- `booking_type` (`tour | accommodation | restaurant | experience | combo`)
- `status` (`pending | confirmed | in_progress | completed | cancelled`)
- `check_in_date` (date)
- `check_out_date` (date)
- `total_amount` (numeric)
- `currency` (varchar)
- `notes` (text)
- `created_by` (FK → users)

### `booking_items`
- **PK** `id` (uuid)
- `booking_id` (FK → bookings)
- `item_type` (`tour_package | room_type | menu_item | experience`)
- `item_id` (uuid)
- `name_snapshot` (varchar)
- `quantity` (int)
- `unit_price` (numeric)
- `currency` (varchar)
- `metadata` (jsonb) — schedule, participants, rate_plan …

### `booking_status_history`
- **PK** `id` (uuid)
- `booking_id` (FK → bookings)
- `status` (same enum as booking)
- `changed_by` (FK → users)
- `changed_at` (timestamp)
- `notes` (text)

### `payments`
- **PK** `id` (uuid)
- `booking_id` (FK → bookings)
- `provider` (`manual | momo | vnpay | stripe | paypal`)
- `transaction_code` (varchar)
- `amount` (numeric)
- `currency` (varchar)
- `status` (`pending | paid | failed | refunded`)
- `paid_at` (timestamp)
- `payload` (jsonb)

### `invoices`
- **PK** `id` (uuid)
- `booking_id` (FK → bookings)
- `invoice_number` (varchar, UQ)
- `issue_date` (date)
- `due_date` (date)
- `amount_due` (numeric)
- `tax_amount` (numeric)
- `status` (`draft | issued | paid | void`)
- `pdf_url` (varchar)

### `restaurant_reservations`
- **PK** `id` (uuid)
- `restaurant_id` (FK → restaurant_profiles)
- `table_id` (nullable FK → restaurant_tables)
- `booking_id` (nullable FK → bookings)
- `reservation_time` (timestamp)
- `num_guests` (int)
- `status` (`pending | confirmed | seated | cancelled | no_show`)
- `notes` (text)

### `experience_reservations`
- **PK** `id` (uuid)
- `experience_id` (FK → experiences)
- `booking_id` (FK → bookings)
- `scheduled_at` (timestamp)
- `participant_adults` (int)
- `participant_children` (int)
- `status` (`pending | confirmed | completed | cancelled`)

---

## Content & Marketing

### `articles`
- **PK** `id` (uuid)
- `title` (varchar)
- `slug` (varchar, UQ)
- `excerpt` (text)
- `content` (jsonb rich text)
- `cover_image_id` (FK → media_assets)
- `status` (`draft | published | archived`)
- `published_at` (timestamp)
- `author_id` (FK → users)
- `tags` (uuid[] FK → tags)
- `seo_title` (varchar)
- `seo_description` (varchar)
- `seo_keywords` (text[])

### `pages`
- **PK** `id` (uuid)
- `key` (varchar, UQ)
- `title` (varchar)
- `content` (jsonb blocks)
- `status` (`draft | published`)
- `published_at`

### `home_layouts`
- **PK** `id` (uuid)
- `version` (int)
- `data` (jsonb conforming to HomeContent schema)
- `is_active` (bool)
- `activated_at` (timestamp)
- `created_by` (FK → users)

### `banners`
- **PK** `id` (uuid)
- `title` (varchar)
- `subtitle` (varchar)
- `cta_label` (varchar)
- `cta_link` (varchar)
- `image_id` (FK → media_assets)
- `display_location` (`home_top | home_mid | home_bottom | landing`)
- `status` (`draft | scheduled | live | expired`)
- `start_at` (timestamp)
- `end_at` (timestamp)

### `reviews`
- **PK** `id` (uuid)
- `booking_id` (nullable FK → bookings)
- `customer_id` (FK → customers)
- `target_type` (`tour | accommodation | restaurant | experience`)
- `target_id` (uuid)
- `rating` (int)
- `title` (varchar)
- `content` (text)
- `status` (`pending | approved | rejected`)
- `responded_by` (FK → users)
- `responded_at`
- `response` (text)

### `notifications`
- **PK** `id` (uuid)
- `channel` (`email | sms | zalo | push`)
- `template_code` (varchar)
- `payload` (jsonb)
- `status` (`queued | sent | failed`)
- `recipient` (varchar)
- `scheduled_at` (timestamp)
- `sent_at` (timestamp)
- `error_message` (text)

---

## System & Settings

### `settings`
- **PK** `id` (uuid)
- `key` (varchar, UQ)
- `value` (jsonb)
- `description` (text)
- `updated_by` (FK → users)

### `webhooks`
- **PK** `id` (uuid)
- `event` (varchar)
- `url` (varchar)
- `headers` (jsonb)
- `secret` (varchar)
- `status` (`active | inactive`)

### `webhook_logs`
- **PK** `id` (uuid)
- `webhook_id` (FK → webhooks)
- `event_payload` (jsonb)
- `response_code` (int)
- `response_body` (text)
- `status` (`success | failed`)
- `sent_at`

---

## Relationships Overview

- A `user` may belong to many `roles`; each `role` carries many `permissions`.
- `tour_packages`, `accommodations`, `experiences` and `restaurant_profiles` can share `tags`, `media_assets`, `locations`, `amenities`.
- `bookings` are central: they link to customers, contain one or many `booking_items`, and spawn `payments`, `invoices`, and specialized reservations.
- `reviews` reference both `customers` and their target entity; moderation handled via status lifecycle.
- `home_layouts` allows versioning of home page content; `pages` store other static marketing pages.
- `settings` and `notifications` enable system configuration and customer engagement automation.

---

## Next Steps

1. Validate the ERD with business stakeholders, adjust enums/fields as needed.
2. Derive TypeORM entity classes, DTOs, and service boundaries from this blueprint.
3. Map high-priority API flows (auth, booking intake, content editing) before implementation.

