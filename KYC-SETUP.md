# Website verification setup

Public routes: `/about-us`, `/privacy-policy`, `/refund-cancellation-policy`,
`/service-delivery-policy`, `/terms-conditions`, `/contact`, `/programs`, `/projects`.
Each is linked from the shared footer and has a browser title and meta description.
The existing Vercel rewrite supports direct route visits and refreshes.

Before submitting the live site for verification:

1. The support phone has been supplied in `src/data/business.js`. Confirm the existing
   contact email, business address and support hours in that same file. The contact section's
   existing `contact@veltrixis.com` is now used consistently instead of the conflicting footer email.
2. The owner confirmed the refund terms during the audit. Review any future changes to the operational commitments in `src/data/policies.js`, particularly the refund
   eligibility and timelines: acknowledge within 2 business days, decide within 7 business days
   after receiving necessary information, initiate within 5 business days after approval,
   then allow 5–10 business days for bank/provider credit. Ensure the business can honor them.
3. Deploy both backend and frontend. The new nullable fields are added to internships,
   projects and events. The current backend uses Hibernate `ddl-auto=update`; environments
   managed with migrations must add equivalent columns before deploying the backend.
   Common text columns: `program_start_info`, `deliverables`, `eligibility`, `delivery_details`.
   Projects and events additionally need `duration` (text) and `fee` (numeric(10,2)).
4. Edit each listing in the existing admin screen. Enter its real total INR fee (0 for free),
   duration, program start information, deliverables, eligibility, delivery method and access
   timeline. Existing registration dates remain separate. No program details or prices were invented.
5. Incomplete listings continue to accept applications, but do not display bank/UPI/QR payment
   instructions. Complete paid listings retain the existing manual payment and registration flow.
   This is a website disclosure guard, not a new gateway integration or bank transfer restriction.
6. On the deployed HTTPS site, verify direct page loads and the actual support/registration
   service connections before submitting the URL. A website update does not itself grant gateway approval.

Checks: `npm run build`, `node --test tests/programDetails.test.js`,
`node tests/publicPages.mjs`. Backend: `mvn -o -DskipTests package`.

Reference reviewed for page scope: [Razorpay profile documentation](https://d6xcmfyh68wv8.cloudfront.net/docs/payments/dashboard/my-account/profile/).
Policies describe Veltrixis services and are not a claim that Razorpay is integrated.
