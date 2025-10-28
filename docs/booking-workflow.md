# Booking Workflow Guide

This document summarizes how the Cồn Phụng tour booking flow works and what the
operations team needs to do after a guest submits a request.

## 1. Customer Journey

1. Guest browses `/tours` and opens a tour detail page.
2. They fill in the **Đặt Tour Ngay** widget, choosing departure date, number of
guests, and optional add-ons.
3. Submission hits `POST /api/public/tours/[slug]/book`, which
   - validates availability and pricing,
   - creates/updates the customer record,
   - stores a booking with status `PENDING` and auto-generated reference,
   - reserves seats on the chosen departure,
   - triggers `sendBookingConfirmationEmail` (currently logs; integrate with
     your email provider when ready).
4. Customer is redirected to `/tours/booking-confirmation` while ops receives a
   notification (email integration pending).

## 2. Operations Handoff Checklist

- Open **Admin → Booking Management** (`/admin/bookings`).
- New bookings appear with status **Pending**. Click a row to view details.
- Contact the guest via email/phone to confirm itinerary and payment method.
- Update booking status to **Confirmed** or **Cancelled** as appropriate.
- Add internal notes in the “Ghi chú nội bộ” field for coordination.
- After payment, mark as **Completed**; this also reflects in dashboard stats
  and revenue totals.
- If the guest changes departure or guest counts, adjust directly in the
  database for now and leave a note—rescheduling tools are on the roadmap.

## 3. Email & Messaging Integration

- Hook into `lib/bookings/notifications.ts#sendBookingConfirmationEmail` with
  your transactional provider (SendGrid/Mailgun/etc.).
- Include booking reference, departure date, and contact channels in the email.
- Optional: add a Slack/Teams webhook for instant ops alerts in the same file.

## 4. Data Visibility & Reporting

- Admin dashboard now displays total bookings, status breakdown, and projected
  revenue.
- Use `GET /api/bookings` for exporting data or building custom reports. Filter
  by status, tour, search keyword, or date range via query parameters.
- `GET /api/bookings/:id` returns full booking details including add-ons and
  notes.

## 5. Housekeeping

- Run `npx prisma migrate deploy` after pulling the latest code to apply the new
  `adminNotes` column on the `Booking` table.
- Restart the Next.js process (`pm2 restart conphung --update-env`) whenever the
  booking flow code changes.
- Backup the database regularly—seat reservations are handled in the booking
  transaction, so data integrity is critical.

## 6. Roadmap Ideas

- Automated payment links and status sync (Momo/ZaloPay/Stripe).
- Guest self-service portal for checking booking status.
- Scheduled reminders before departure day via email/SMS.
- Reports by tour/date range for revenue forecasting.

Feel free to expand this document as the process evolves.
