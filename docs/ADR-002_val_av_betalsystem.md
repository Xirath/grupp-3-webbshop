# ADR-02: Selection of Payment Solution (Stripe Embedded Checkout)

- **Status:** Suggestion
- **Date:** 2026-10-04
- **Participants:** Daniel
- **Related Issue/Ticket:** #27

---

## 1. Context & Problem Statement

The webshop requires a secure, modern, and reliable checkout payment solution. We face the following requirements and constraints:

- **Security & PCI-DSS Compliance:** Sensitive credit card details must never pass through or be stored on our own server or database.
- **User Experience (UX):** The checkout flow should feel seamless, cohesive, and professional without needlessly redirecting the customer away from our webshop.
- **Developer Experience (DX) & Tech Stack:** The solution needs to integrate smoothly with Next.js (App Router, TypeScript, and Server Actions/Route Handlers) and offer an instant sandbox testing environment without requiring real bank certificates.
- **Testability & Learning Goals:** We want to gain practical experience integrating an industry-standard payment provider.

---

## 2. Considered Options

### Option A: Stripe (Embedded Checkout) — [Chosen Option]

Stripe provides a modern developer platform with dedicated React components (`@stripe/react-stripe-js`) that can be embedded directly onto our checkout page.

- **Pros:**
  - **Exceptional DX:** Gold-standard documentation, complete TypeScript support, and clear Next.js guides.
  - **Instant Sandbox Access:** Test keys and mock test cards (`4242...`) work out of the box with zero business vetting.
  - **Security & Compliance:** Full PCI-DSS compliance via isolated iframes/elements while keeping the user on our site.
  - **Multi-Method Support:** Can enable Klarna, Apple Pay, Google Pay, and cards from within the Stripe Dashboard without rewriting code.
- **Cons:** Requires managing both client and server Stripe SDKs and handling session IDs on return.

### Option B: Klarna Payments (Direct Integration)

Integrating Klarna directly as the primary standalone payment provider.

- **Pros:** Highly recognizable and trusted in the Swedish and Nordic markets; strong consumer preference for "Pay Later".
- **Cons:** Integration and testing environments require merchant account verification; developer documentation and Next.js sample code are less comprehensive compared to Stripe.

### Option C: PayPal (Standard / Braintree)

Using PayPal checkout buttons or Braintree integration.

- **Pros:** High global brand recognition and buyer protection reputation.
- **Cons:** The developer SDKs and portal are historically clunky, and the checkout flow relies heavily on popups or external window redirects that disrupt the unified design of the webshop.

### Option D: Swish (Direct API)

Integrating the Swedish mobile payment system Swish via its merchant API.

- **Pros:** Extreme popularity and ease-of-use for Swedish mobile users.
- **Cons:** Requires Swedish corporate bank contracts and complex SSL/TLS certificate handling for API authentication, making it impractical and overly complex for a sandbox development project.

---

## 3. Decision

We decide to adopt **Option A: Stripe (Embedded Checkout)**.

**Rationale:**

1. **Developer Experience & Speed:** Stripe offers the easiest onboarding, instant sandbox testing with test cards, and seamless integration with Next.js App Router.
2. **Security & Frictionless UX:** The _Embedded_ mode allows customers to complete transactions directly within our webshop while Stripe takes full responsibility for PCI-DSS compliance.
3. **Extensibility:** If we want to offer Klarna or digital wallets later, Stripe allows us to enable them directly via the dashboard without needing separate backend integrations.

---

## 4. Consequences

### Positive Consequences

- **High Security:** No sensitive payment or card data ever touches or gets stored in our backend/database.
- **Seamless Checkout UX:** Customers complete payments directly on our checkout page without disorienting redirects.
- **Straightforward Testing:** Standardized test cards allow simple QA for success, decline, and error scenarios.
- **Future-Proof:** Additional payment methods can be enabled dynamically via the Stripe Dashboard.

### Negative Consequences / Risks

- **Environment Variable Management:** Requires careful handling of `STRIPE_SECRET_KEY` (server-only) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client). Secret keys must strictly remain in `.env.local` and never be committed to Git.
- **Session Lifecycle Handling:** We must manage checkout session creation on the server and properly verify the session status on the order return/confirmation page.

---

## 5. How We Verify the Decision

_How do we know the decision was successful?_

- [ ] A `checkout_session` can be created on the server and its `clientSecret` returned to the checkout page.
- [ ] The Stripe Embedded Checkout component renders cleanly in the checkout page without hydration or layout errors.
- [ ] Test purchases using Stripe test cards (`4242 4242 4242 4242`) complete successfully.
- [ ] The customer is correctly routed to an order confirmation page with valid session details after payment.
- [ ] No secret Stripe keys (`STRIPE_SECRET_KEY`) are exposed to the client bundle or committed to Git.
