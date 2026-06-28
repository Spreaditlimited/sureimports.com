# Paid Consultation And Zoom Migration Plan

SureImports consultation should not use Calendly. The booking flow should require payment before a call slot is confirmed.

## Target Flow

```txt
Choose consultation
Pay with Paystack
Verify payment
Show available slots
Book slot
Create Zoom meeting
Send confirmation
Store booking and payment record
```

## Zoom Environment Variables

The Tochukwu implementation uses Zoom server-to-server OAuth:

```txt
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_HOST_USER_ID=
ZOOM_WEBHOOK_SECRET_TOKEN=
```

Copy values through local env or deployment secrets only. Do not expose them in chat, logs, or committed files.

## Booking Rules

- A consultation slot cannot be booked without a verified successful payment.
- A paid booking token should be single-use.
- Slots should be generated in Africa/Lagos time.
- Zoom meetings should use waiting room and disallow join-before-host.
- Cancellation/reschedule should preserve payment history.
- Admin should see booking status, Zoom URL, payment reference, customer details, outcome, and follow-up notes.

## Offer Routing

The SEO and lead intent engine should route low-confidence beginner import leads to the paid consultation offer. High-intent leads should go to the more specific service first:

```txt
verify_supplier
ship_with_us
pay_supplier
procurement
phone_sourcing
laptop_sourcing
corporate_procurement
procurement_quote
paid_consultation
```
