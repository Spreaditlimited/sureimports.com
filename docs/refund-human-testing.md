# Refunds and partner order adjustments — human acceptance

## Where to start

- Sure Imports customer refunds: http://localhost:3001/dashboard/refunds
- Admin refunds: http://localhost:3000/dashboard/refunds
- Admin procurement: http://localhost:3000/dashboard/procurement
- Partner orders/wallet: http://localhost:3003/partners/dashboard
- Affiliate earnings: http://localhost:3002/dashboard/earnings
- Partner customer: use the business storefront's customer dashboard, not the partner-owner dashboard. Locally its route is `/partners/storefront/<business-slug>/dashboard` on port 3003.

Use separate browser profiles for customer, partner and admin. Do not use existing customers' orders as disposable test fixtures. The automated database scripts create synthetic records inside transactions and roll them back; they intentionally leave no ready-made paid orders behind.

**Local and production share the database.** A real checkout, refund or withdrawal from localhost still moves real money when live credentials are selected. Test local screens and permissions first. Coordinate deployment of all affected applications through GitHub before a live financial test so callbacks reach the matching implementation. Nothing was deployed during this work.

## Main-site refund journey

1. Use an eligible order with a refund entitlement. Open Refunds as its customer. A different customer's session must not see or request it.
2. For NGN bank settlement, check the NGN entitlement and verified bank destination. Submit once, then refresh: it must remain one request.
3. For an international entitlement, check USD. A UK bank destination must show both the USD entitlement and exact GBP settlement at the frozen rate. Changing the admin rate afterward must not alter an existing request.
4. In Admin → Refunds, verify the payment method, currency and frozen amount. Bank confirmation records an actual completed transfer; it does not send one. The amount/currency must match and the transfer reference must be unique.
5. For PayPal, explicitly approve the original-payment refund. It returns the capture currency, not a newly calculated bank-conversion amount. Pending is not completed. Refresh/status checks must never create a replacement refund.
6. Check customer progress, admin settlement totals and branded request/completion email delivery. Emails are queued durably; confirm the configured worker has run before treating a delivery delay as a financial failure.
7. Check affiliate earnings: a product reduction creates a separate deduction, preserving the original conversion and payout. A shipping-only procurement reduction leaves product commission unchanged. Already-paid commission can become a recoverable deduction against later earnings.

## Partner supplemental shipping payment

1. Customer creates and pays for a normal storefront order. Partner approves it for processing. Admin then sees the operational procurement order.
2. Admin opens that order and updates final shipping weight/volume, or uses **Order adjustments** to propose revised product and shipping amounts with a clear reason.
3. Until the partner approves, the customer must not see an unapproved change or payment demand. A second active change cannot be opened over the first.
4. Partner opens Orders and reviews the before/after comparison. Decline requires a reason; approval unlocks the customer's next step.
5. Customer opens the same order, confirms the additional amount and pays. Check payment status if the return is delayed. Refreshing or receiving the callback twice must add only one ledger payment.
6. Original payment/quote remain intact. Revised totals update after confirmation. Shipping increases do not generate partner earnings; the actual additional payment fee is deducted from the partner's earnings.
7. An order waiting for its final shipping payment advances only after the approved adjustment settles. An unresolved adjustment prevents receipt/release/withdrawal completion.

## Partner reduction/refund

1. Propose a lower product or shipping amount; partner approves.
2. Customer sees refund progress rather than a payment button.
3. Admin explicitly issues the approved refund against the original payment(s). Currency follows each original capture. It cannot exceed available capture amounts.
4. Shipping-only reductions preserve product earnings. Product reductions recalculate service charge, VAT and partner share using the order's saved rates. Previously incurred payment fees remain charged to the partner.
5. The order is updated only after every refund part is confirmed complete. Original successful payments remain in the ledger; refunds are separate records.
6. A full reduction to zero does not advance the order to shipping. Cancellation requires the refund to be complete.

## Recovery and holds

- **Lost response:** use status checking or the existing provider refund reference. Do not submit a new refund. Canonical provider details must match the allocation.
- **Confirmed failure:** choose **Verify failure and prepare retry**. It makes no payment. Only after successful verification can admin explicitly approve a replacement attempt. The failed attempt stays in history and is excluded from reserved totals.
- **Refund made in provider dashboard:** propose/approve the corresponding price reduction, then use **Already refunded outside this dashboard?** to verify and record its reference. This records money already returned; it must not send another refund.
- **Main external PayPal refund:** link an exact existing entitlement, or classify the retained eligible product value/shipping units in Admin → Refunds. Failed/cancelled external refunds can only be closed after provider verification.
- **Held partner earnings:** reconcile all provider refunds and outstanding changes before admin releases a hold. Releasing a hold does not bypass customer receipt. After a reviewed dispute is cleared, linked original and supplemental ledger payments are restored consistently.
- **Withdrawal:** verify it stays blocked while changes or required fee reconciliation are outstanding. Customer delivery/pickup confirmation is separate from Sure Imports handing goods to the partner.

## Verification evidence

Final suites: 276 main, 157 partner, 94 admin, 5 affiliate — 532 passed. Four production builds passed. Main TypeScript passed separately. Four database smoke scripts passed with rollback-only fixtures and mocked providers. Admin adjustment controls were browser-checked on mobile dark and desktop light themes; protected local APIs rejected anonymous requests.

Automated tests do not certify actual bank settlement, PayPal/Paystack availability or email delivery. Those are the remaining live human acceptance checks after coordinated deployment.

UK partner activation, GBP withdrawals and platform subscriptions are a separate rollout. Do not interpret these refund tests as enabling those unfinished programme features.
