# Partner business-fit review

Business fit is reviewed separately from identity/KYC. Registered businesses do not automatically qualify for activation.

## Applicant

Business-readiness answers cover target customers, first-ten-customer plan, audience/network, public evidence, sales experience, demand, operating responsibility and resources. Customer lists and private conversations are not requested. No minimum following, previous-sales volume or marketing budget is imposed.

New submissions require complete answers and acknowledgement of support and delivery responsibilities. Legacy submitted applications can add answers without re-uploading KYC. Changes requested / not-ready applicants can revise the plan; previous fit approval is invalidated on changed answers.

## Admin

The partner review workspace includes an independent business-fit scorecard. Each criterion is rated 0–5:

- Relevant customer access: 30%
- Acquisition plan: 25%
- Operations: 25%
- Experience / demand: 10%
- Understanding: 10%

75+ suggests a pilot; 55–74 suggests clarification; below 55 suggests not ready. These are reviewer guidelines, not automatic approvals. Approving below 75 requires an override explanation. Unresolved hard blockers prevent pilot approval regardless of score.

Decisions: PILOT_APPROVED, REQUEST_CHANGES, NOT_READY. Evidence and concerns remain internal; applicant sees the reason and next steps. A pilot approval requires a 30–60-day duration and measurable targets/review plan. Pilot execution and subsequent commercial expansion still require operational review; this form does not automatically start a pilot or schedule a review job.

## Security and storage

Answers are stored inside existing encrypted detailsCiphertext. The businessFit review object is stored inside encrypted reviewCiphertext, independently of the existing KYC review fields. Events contain encrypted snapshots. Revision checks and row locks prevent stale updates. Existing tables require no migration. No previous applications are bulk-updated.

Only the authenticated owner can update answers; only an authorized super-admin can review them. Same-origin checks and bounded bodies protect write endpoints. No public-profile URL is fetched by the server. Applicant responses never include internal scores, evidence or concerns.

Admin activation now requires pilot approval in addition to KYC and exclusive membership. The existing rollout flag remains disabled. No storefront, payment collection or settlement is enabled by a business-fit decision.

Decisions are shown in the applicant onboarding page. Business-fit events are audited without email delivery in this implementation.
