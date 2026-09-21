# Veltrixis website-information audit

Audit date: 21 September 2026.

**Result: local website fixes are complete; live submission readiness remains incomplete.**
The public HTTPS website is reachable, but its deployed JavaScript bundle does not contain
the new policy routes or program disclosures. Deploy the updated frontend and backend,
and complete the real catalog information below before submitting the website.

Statuses below refer to the audited local implementation: PASS means present and checked;
FIXED means a gap was corrected; MISSING means information or deployment work remains.
They are not payment-gateway approval or a certification of legal compliance.

| Requirement | Status | Evidence / remaining work |
|---|---|---|
| About Us | FIXED | Public service description and audience; removed unsupported homepage counts and AI claims. |
| Business Category | PASS | Exact education/training/internship/project collaboration category on About, homepage and footer. |
| Privacy Policy | FIXED | Added actual authentication, Vercel, Render and Supabase database disclosures; clarified manual payments and conditional gateway use. |
| Refund Policy | PASS | Eligibility, exclusions, remedies, original payment method and processing timelines; owner confirmed these match operations. |
| Cancellation Policy | PASS | Email request process, required references, before/after delivery conditions and support details. |
| Service Delivery / Shipping Policy | FIXED | Digital-only delivery; includes sessions, mentorship and repositories; access timelines belong to each listing. |
| Terms & Conditions | FIXED | Added explicit suspension, termination, closure and review process, preserving refund rights. |
| Contact Us | FIXED | Existing working form retained; supplied phone is now a telephone link rather than placeholder styling. |
| Products/Programs Details | MISSING | Eight live records need real program information; incomplete listings cannot display payment instructions locally. |
| Pricing | MISSING | Six live records lack fees. Two paid internship prices are known. Enter actual total fees or explicitly set 0 for genuinely free offerings. |
| Public Accessibility | FIXED | Public routes are outside the admin guard; blocked browser storage can no longer crash public pages. Deployment remains pending. |
| Footer Links | PASS | All eight required destinations rendered and linked across public pages, including login. |
| Mobile Responsiveness | PASS | Real-browser checks at 390px and 1440px; navigation opens and pages fit without horizontal overflow. |
| Payment Transparency | FIXED | Fee, scope, duration, deliverables, delivery, refund and support are shown before payment; zero/unknown/incomplete fees do not expose QR/bank instructions. |
| HTTPS/Routes | FIXED | Production localhost fallback removed; home anchor repaired; short URL aliases and sitemap added. Live HTTPS and catalog-origin CORS verified. |
| Contact Information | PASS | Veltrixis, contact@veltrixis.com, supplied 9652887222, existing Hyderabad address and support hours share one configuration. |
| No Broken Links | FIXED | Home fragment repaired; public destinations and aliases checked; existing logo and payment QR URLs returned HTTP 200. |

## Real information still needed

All eight live listings are missing **programStartInfo, deliverables, eligibility and
deliveryDetails**. Enter these through the existing admin forms; do not substitute
registration opening/closing dates for the program start or invent access promises.

| Live listing | Published fee | Other missing information |
|---|---|---|
| Full Stack Java Developer Intern (internship 2) | INR 2,999.00 | Four common fields above; duration already 3 Months. |
| AI & Machine Learning Intern (internship 3) | Not published | Actual fee plus four common fields; duration already 8 Weeks. |
| Frontend Developer Intern (internship 4) | INR 1,499.00 | Four common fields above; duration already 8 Weeks. |
| AI-Powered Resume Analyzer (project 1) | Not published | Actual fee, duration and four common fields. |
| Smart Campus Navigation System (project 2) | Not published | Actual fee, duration and four common fields. |
| Student Expense Tracker (project 3) | Not published | Actual fee, duration and four common fields. |
| Real-Time Collaborative Study Platform (project 4) | Not published | Actual fee, duration and four common fields. |
| Generative AI & LLM Workshop (event 1) | Not published | Actual fee, duration and four common fields. |

No required contact placeholder remains. Confirm that the supplied phone, email, address
and support hours match the business details submitted to the gateway. The owner confirmed
the existing refund operating commitments during this audit; no refund terms were invented anew.

## Scope and evidence

- Source review covered routing, authentication, public views, admin program fields, APIs,
  policy content, forms, payment instructions, metadata and deployment rewrite configuration.
- The application uses its Spring backend for administrator authentication and a
  Supabase-hosted PostgreSQL database. No Firebase dependency or authentication gate was
  found in this frontend. Existing provider configuration and database records were preserved.
- `npm run build` passes. Payment-rule tests and component-render checks pass, including
  the homepage and all eight new public pages. Browser audit automation is in
  `tests/browser-audit.ps1` and uses an isolated headless Edge context against the local build.
  Final browser result: 20 desktop/mobile page visits, mobile menus, 4 aliases, 9
  paid/free/incomplete registration dialogs and explicitly blocked-storage access; zero failures.
- Public live catalog GET requests returned HTTP 200 for internships, projects and events.
  All three returned the correct CORS allow-origin for `https://www.veltrixis.co`.
- Live bundle `/assets/index-lLcliiE7.js` lacked the new policy routes and program disclosures
  at audit time. An HTTP 200 from the SPA host alone does not prove a policy route exists.
- No live registrations, contact messages, payments, refunds, admin writes or database
  changes were submitted during the audit. Real form delivery, bank settlement and gateway
  onboarding approval therefore remain outside the verified results.
- Catalog load failures now show a retry/support state instead of masquerading as an empty
  catalog. Homepage sections load independently, so one unavailable API does not remove
  every program section or its navigation anchor.

Website-information scope was cross-checked against the gateway's published
[website/profile requirements](https://d6xcmfyh68wv8.cloudfront.net/docs/payments/dashboard/my-account/profile/).
Final acceptance depends on the selected gateway's review and the actual deployed website.

See `KYC-SETUP.md` for deployment and database-field notes.
