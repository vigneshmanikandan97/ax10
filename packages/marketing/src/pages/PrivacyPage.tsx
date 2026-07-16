import { PageLayout } from '../components/layout/PageLayout'
import { CONTACT_EMAIL, SUPPORT_EMAIL } from '../data/content'

export function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="Last updated: 11 June 2026 · AX10"
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          AX10 (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
          is an AI-first engineering studio based in Chennai, India. We respect your
          privacy and are committed to protecting personal data in accordance with
          the Digital Personal Data Protection Act, 2023 (DPDP Act), the General
          Data Protection Regulation (GDPR) where applicable, and other relevant
          privacy laws.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, store, and protect
          personal information when you visit our website, contact us, or engage
          our services.
        </p>
      </section>

      <section>
        <h2>2. Data Controller</h2>
        <p>
          <strong>AX10</strong>
          <br />
          Chennai, Tamil Nadu, India
          <br />
          Email:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          For GDPR purposes, AX10 acts as the data controller for personal data
          processed through this website and our commercial engagements.
        </p>
      </section>

      <section>
        <h2>3. Information We Collect</h2>
        <h3>3.1 Information you provide</h3>
        <ul>
          <li>Name, email address, company name, and message content submitted via our contact form</li>
          <li>Business correspondence, proposals, and project requirements shared during engagements</li>
          <li>Billing and contractual information where applicable</li>
        </ul>
        <h3>3.2 Information collected automatically</h3>
        <ul>
          <li>Device type, browser, IP address, and approximate location derived from IP</li>
          <li>Pages visited, referral source, and basic usage analytics</li>
          <li>Cookies and similar technologies as described in Section 8</li>
        </ul>
        <h3>3.3 Client project data</h3>
        <p>
          When delivering engineering services, we may process data you provide as
          part of a project (source code, designs, user data in staging environments,
          etc.). Processing of such data is governed by our service agreement and
          applicable data processing terms.
        </p>
      </section>

      <section>
        <h2>4. Lawful Basis for Processing</h2>
        <p>We process personal data on the following bases:</p>
        <ul>
          <li>
            <strong>Consent</strong>: when you submit a contact enquiry or subscribe to communications
          </li>
          <li>
            <strong>Contract</strong>: to perform services you have engaged us to deliver
          </li>
          <li>
            <strong>Legitimate interests</strong>: to operate and improve our website, prevent fraud, and pursue business development in a proportionate manner
          </li>
          <li>
            <strong>Legal obligation</strong>: where required by applicable law, tax, or regulatory requirements
          </li>
        </ul>
        <p>
          Under the DPDP Act, we process personal data for lawful purposes with
          appropriate notice and, where required, your consent.
        </p>
      </section>

      <section>
        <h2>5. How We Use Your Information</h2>
        <ul>
          <li>Respond to enquiries and provide requested information</li>
          <li>Deliver, manage, and improve our engineering services</li>
          <li>Send administrative communications related to active projects</li>
          <li>Maintain website security and diagnose technical issues</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
        <p>
          We do not sell personal data. We do not use contact form submissions to
          train third-party AI models without explicit consent.
        </p>
      </section>

      <section>
        <h2>6. Data Sharing and Processors</h2>
        <p>We may share personal data with:</p>
        <ul>
          <li>Cloud hosting and infrastructure providers (e.g. deployment platforms, email services)</li>
          <li>Professional advisers (legal, accounting) under confidentiality obligations</li>
          <li>Sub-processors engaged for specific project delivery, with your knowledge where required</li>
        </ul>
        <p>
          All processors are bound by contractual data protection obligations
          consistent with DPDP and GDPR standards. International transfers, where
          they occur, are protected by appropriate safeguards such as standard
          contractual clauses or equivalent mechanisms.
        </p>
      </section>

      <section>
        <h2>7. Data Retention</h2>
        <ul>
          <li>Contact form submissions: up to 24 months unless an engagement proceeds</li>
          <li>Active client records: duration of engagement plus up to 7 years for legal and accounting purposes</li>
          <li>Website analytics: typically 14 months, aggregated where possible</li>
        </ul>
        <p>
          We delete or anonymise data when it is no longer necessary for the
          purposes for which it was collected.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>
          We use essential cookies required for site functionality. Analytics cookies,
          if enabled, help us understand aggregate traffic patterns. You can control
          cookies through your browser settings. Disabling cookies may affect certain
          site features.
        </p>
      </section>

      <section>
        <h2>9. Your Rights</h2>
        <h3>Under the DPDP Act (India)</h3>
        <ul>
          <li>Right to access information about personal data we process about you</li>
          <li>Right to correction and erasure of inaccurate or unnecessary data</li>
          <li>Right to withdraw consent where processing is consent-based</li>
          <li>Right to nominate another individual to exercise rights on your behalf in certain circumstances</li>
          <li>Right to grievance redressal via our contact channel and the Data Protection Board of India</li>
        </ul>
        <h3>Under GDPR (where applicable)</h3>
        <ul>
          <li>Right of access, rectification, erasure, and restriction of processing</li>
          <li>Right to data portability for data processed by automated means</li>
          <li>Right to object to processing based on legitimate interests</li>
          <li>Right to lodge a complaint with your supervisory authority</li>
        </ul>
        <p>
          To exercise any of these rights, contact{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
          . We will respond within 30 days (or as required by applicable law).
        </p>
      </section>

      <section>
        <h2>10. Security</h2>
        <p>
          We implement appropriate technical and organisational measures including
          access controls, encryption in transit, and least-privilege practices.
          No method of transmission over the internet is completely secure; we
          encourage you not to send sensitive credentials via unencrypted email.
        </p>
      </section>

      <section>
        <h2>11. Children&apos;s Privacy</h2>
        <p>
          Our services are directed at businesses and professionals. We do not
          knowingly collect personal data from individuals under 18. Contact us if
          you believe we have inadvertently collected such data.
        </p>
      </section>

      <section>
        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be posted on this page with an updated effective date. Continued use
          of our website after changes constitutes acknowledgment of the revised policy.
        </p>
      </section>

      <section>
        <h2>13. Contact & Grievance Officer</h2>
        <p>
          For privacy questions, data subject requests, or grievances under the DPDP Act:
        </p>
        <p>
          <strong>Grievance Officer</strong>
          <br />
          AX10
          <br />
          Email:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </PageLayout>
  )
}
