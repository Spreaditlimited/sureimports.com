# Affiliate attribution

The main Sure Imports application accepts affiliate links in the canonical form
`https://www.sureimports.com/?ref=CODE`. The legacy `affRef` query parameter is
accepted only for backwards compatibility.

Attribution is first-touch for 30 days. The server validates an active affiliate,
creates a privacy-preserving referral record, and sets a signed, HttpOnly,
SameSite=Lax cookie. A valid attribution is claimed when a customer account is
created, or when an existing unclaimed customer next signs in.
`affiliate_referrals.customerReference` is unique, so one customer can only be
claimed by one affiliate. Registration APIs ignore affiliate codes sent in
request bodies.

## Required environment

`AFFILIATE_SECURITY_KEY` must contain the same 32-byte base64 key used by the
affiliate application. It signs attribution cookies, hashes visitor identifiers,
and enables email-fingerprint comparison for self-referral prevention. Configure
the value independently in every environment; never commit it.
