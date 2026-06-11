import { PageLayout } from '../components/layout/PageLayout'
import { CONTACT_EMAIL, SUPPORT_EMAIL } from '../data/content'

export function TermsPage() {
  return (
    <PageLayout
      title="Terms & Conditions"
      subtitle="Last updated: 11 June 2026 · AX10"
    >
      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the
          AX10 website and any enquiry or engagement with our
          services. By accessing this website or engaging AX10, you agree to these
          Terms. If you do not agree, please do not use our website or services.
        </p>
      </section>

      <section>
        <h2>2. About AX10</h2>
        <p>
          AX10 (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
          is an AI-first engineering studio providing software design, development,
          and consulting services. We are based in Chennai, India and serve clients
          internationally.
        </p>
      </section>

      <section>
        <h2>3. Services</h2>
        <p>
          Service scope, deliverables, timelines, fees, and acceptance criteria for
          any paid engagement are defined in a separate statement of work (SOW),
          proposal, or master services agreement (MSA). In the event of conflict,
          the signed commercial agreement prevails over these website Terms.
        </p>
      </section>

      <section>
        <h2>4. Website Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the website for unlawful purposes or to transmit harmful code</li>
          <li>Attempt unauthorised access to our systems or data</li>
          <li>Scrape, mirror, or reproduce site content for commercial use without permission</li>
          <li>Misrepresent your affiliation with AX10</li>
        </ul>
        <p>
          We reserve the right to restrict access to the website at our discretion.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <h3>5.1 Our IP</h3>
        <p>
          All content on this website, including branding, copy, design, code samples,
          and methodologies, is owned by or licensed to AX10 and protected by
          applicable intellectual property laws. You may not reproduce or distribute
          it without written consent.
        </p>
        <h3>5.2 Client IP</h3>
        <p>
          Unless otherwise agreed in writing, intellectual property in deliverables
          created specifically for a client transfers to the client upon full payment.
          AX10 retains rights to pre-existing tools, frameworks, libraries, and general
          know-how used across engagements.
        </p>
        <h3>5.3 Portfolio rights</h3>
        <p>
          Unless a client requests otherwise in writing, AX10 may reference the
          engagement in portfolios and marketing materials without disclosing
          confidential information.
        </p>
      </section>

      <section>
        <h2>6. Confidentiality</h2>
        <p>
          Both parties agree to protect confidential information shared during
          discussions and engagements. Confidential information does not include
          information that is publicly available, independently developed, or
          rightfully received from a third party without restriction.
        </p>
      </section>

      <section>
        <h2>7. Fees and Payment</h2>
        <ul>
          <li>Fees are as specified in the applicable commercial agreement</li>
          <li>Invoices are payable within the stated payment terms (typically 15–30 days)</li>
          <li>Late payments may incur interest at 1.5% per month or the maximum permitted by law</li>
          <li>Client is responsible for applicable taxes unless otherwise stated</li>
        </ul>
      </section>

      <section>
        <h2>8. Warranties and Disclaimers</h2>
        <p>
          We warrant that services will be performed with reasonable skill and care
          consistent with industry standards. Except as expressly stated in a signed
          agreement, services and this website are provided &ldquo;as is&rdquo; without
          warranties of any kind, whether express or implied, including merchantability,
          fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          We do not guarantee uninterrupted website availability or that AI-assisted
          outputs will be error-free without human review.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, AX10 shall not be liable for indirect,
          incidental, special, consequential, or punitive damages, including loss of
          profits, data, or business opportunity.
        </p>
        <p>
          Our aggregate liability arising from any engagement or use of this website
          shall not exceed the fees paid by you to AX10 in the twelve (12) months
          preceding the claim, or INR 1,00,000, whichever is greater, unless mandatory
          law provides otherwise.
        </p>
      </section>

      <section>
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify AX10 against claims arising from your misuse of the
          website, your breach of these Terms, or your violation of third-party rights
          in materials you provide to us.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          Either party may terminate a service engagement per the terms of the applicable
          agreement. Upon termination, you must pay for work performed to date. Provisions
          relating to confidentiality, IP, liability, and governing law survive termination.
        </p>
      </section>

      <section>
        <h2>12. Governing Law and Disputes</h2>
        <p>
          These Terms are governed by the laws of India. Courts in Chennai, Tamil Nadu
          shall have exclusive jurisdiction, subject to any mandatory consumer protection
          or GDPR rights applicable to EU/EEA data subjects.
        </p>
        <p>
          We encourage good-faith negotiation before formal proceedings. Either party
          may seek injunctive relief for IP or confidentiality breaches.
        </p>
      </section>

      <section>
        <h2>13. Changes</h2>
        <p>
          We may update these Terms periodically. Updated Terms will be posted on this
          page with a revised date. Material changes to active commercial agreements
          require mutual written consent.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>
          Questions about these Terms:
          <br />
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
          <br />
          <span className="mt-2 block text-sm text-text-secondary">
            For client support or grievances:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </span>
        </p>
      </section>
    </PageLayout>
  )
}
