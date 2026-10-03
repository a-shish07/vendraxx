'use client'

import Link from 'next/link'

const sections = [
  {
    number: '01',
    title: 'Introduction',
    content: (
      <>
        <p>
          Welcome to Vendrax Pvt. These Terms & Conditions govern your use of
          our website, products, services, and any purchases made through our
          online store.
        </p>

        <p>
          By accessing or using this website, you agree to comply with these
          Terms & Conditions. If you do not agree with any part of these terms,
          please do not use our website or place an order.
        </p>
      </>
    ),
  },
  {
    number: '02',
    title: 'Eligibility',
    content: (
      <>
        <p>
          You must be legally capable of entering into a binding agreement
          under applicable Indian law to use this website and purchase products
          from us.
        </p>

        <p>
          If you are using this website on behalf of another person or
          organisation, you confirm that you have the authority to accept these
          terms on their behalf.
        </p>
      </>
    ),
  },
  {
    number: '03',
    title: 'Account & Registration',
    content: (
      <>
        <p>
          Certain features of our website may require you to create an account.
          You are responsible for providing accurate, complete, and up-to-date
          information.
        </p>

        <p>
          You are also responsible for maintaining the confidentiality of your
          account credentials and for all activities performed through your
          account.
        </p>

        <p>
          Please notify us promptly if you believe that your account has been
          accessed without your permission.
        </p>
      </>
    ),
  },
  {
    number: '04',
    title: 'Products & Product Information',
    content: (
      <>
        <p>
          We make reasonable efforts to ensure that product descriptions,
          images, specifications, availability, and other information displayed
          on the website are accurate.
        </p>

        <p>
          However, product colours, packaging, appearance, and other visual
          characteristics may vary slightly from the images displayed online.
        </p>

        <p>
          We reserve the right to correct errors, update product information,
          or discontinue products without prior notice.
        </p>
      </>
    ),
  },
  {
    number: '05',
    title: 'Pricing & Payments',
    content: (
      <>
        <p>
          All prices displayed on the website are shown in Indian Rupees (₹),
          unless stated otherwise.
        </p>

        <p>
          Product prices, offers, discounts, taxes, and delivery charges may
          change from time to time. The applicable price at the time your order
          is placed will generally be the price applicable to that order,
          subject to order confirmation and availability.
        </p>

        <p>
          We may offer multiple payment methods, including online payment and
          Cash on Delivery where available. Payment processing may be handled
          by third-party payment service providers.
        </p>
      </>
    ),
  },
  {
    number: '06',
    title: 'Orders & Order Acceptance',
    content: (
      <>
        <p>
          Placing an order on our website constitutes a request to purchase the
          selected products. An order may be subject to verification,
          availability, payment confirmation, and other checks.
        </p>

        <p>
          We reserve the right to cancel or decline an order in circumstances
          such as incorrect pricing, product unavailability, suspected
          fraudulent activity, technical errors, or other legitimate reasons.
        </p>

        <p>
          If an order is cancelled after payment has been successfully received,
          any eligible refund will be processed according to our Refund Policy.
        </p>
      </>
    ),
  },
  {
    number: '07',
    title: 'Shipping & Delivery',
    content: (
      <>
        <p>
          Orders are shipped to the delivery address provided by the customer
          during checkout.
        </p>

        <p>
          Delivery timelines displayed on the website are estimates and may be
          affected by factors including courier delays, weather, holidays,
          operational issues, incorrect addresses, or circumstances beyond our
          reasonable control.
        </p>

        <p>
          Customers are responsible for providing a complete and accurate
          delivery address and contact information.
        </p>
      </>
    ),
  },
  {
    number: '08',
    title: 'Order Cancellation',
    content: (
      <>
        <p>
          Cancellation requests may be accepted only before an order reaches a
          stage where cancellation is no longer possible.
        </p>

        <p>
          Once an order has been dispatched or otherwise processed for
          fulfilment, cancellation may not be possible. In such cases, the
          customer may need to follow the applicable return or refund process.
        </p>

        <p>
          For specific cancellation requests, please contact our support team
          as soon as possible after placing the order.
        </p>
      </>
    ),
  },
  {
    number: '09',
    title: 'Returns & Refunds',
    content: (
      <>
        <p>
          Returns and refunds are governed by our Refund & Cancellation Policy.
          Please review that policy before placing an order.
        </p>

        <p>
          Eligibility for a return or refund may depend on the product,
          condition of the item, reason for the request, order status, and
          applicable laws and policies.
        </p>

        <Link
          href="/refund-policy"
          className="inline-flex items-center gap-2 mt-2 font-medium text-brand hover:text-accent transition-colors"
        >
          View Refund & Cancellation Policy
          <span aria-hidden="true">→</span>
        </Link>
      </>
    ),
  },
  {
    number: '10',
    title: 'User Responsibilities',
    content: (
      <>
        <p>
          You agree not to misuse our website, attempt unauthorised access,
          interfere with website functionality, submit false information, or
          use our services for unlawful purposes.
        </p>

        <p>
          You must not use automated systems or other methods to interfere with
          the normal operation of the website or attempt to gain unauthorised
          access to accounts, systems, or data.
        </p>
      </>
    ),
  },
  {
    number: '11',
    title: 'Intellectual Property',
    content: (
      <>
        <p>
          Unless otherwise stated, the website and its content, including
          logos, branding, text, graphics, product descriptions, images,
          layouts, and software, are owned by or licensed to Vendrax Pvt.
        </p>

        <p>
          You may not reproduce, distribute, modify, publish, sell, or
          commercially exploit website content without prior written
          permission, except where permitted by applicable law.
        </p>
      </>
    ),
  },
  {
    number: '12',
    title: 'Third-Party Services',
    content: (
      <>
        <p>
          Our website may use third-party services such as payment gateways,
          logistics providers, analytics services, communication services, or
          other technology providers.
        </p>

        <p>
          Your use of third-party services may also be subject to the terms and
          privacy policies of those providers.
        </p>
      </>
    ),
  },
  {
    number: '13',
    title: 'Limitation of Liability',
    content: (
      <>
        <p>
          We will take reasonable steps to provide a reliable shopping
          experience. However, we do not guarantee that the website will always
          be available, uninterrupted, error-free, or free from every possible
          technical issue.
        </p>

        <p>
          To the extent permitted by applicable law, Vendrax Pvt. will not be
          responsible for indirect or consequential losses arising from the use
          of the website or services.
        </p>

        <p>
          Nothing in these terms is intended to exclude or limit any liability
          that cannot legally be excluded or limited under applicable law.
        </p>
      </>
    ),
  },
  {
    number: '14',
    title: 'Privacy',
    content: (
      <>
        <p>
          Your use of our website may involve the collection and processing of
          personal information. Such information will be handled according to
          our applicable Privacy Policy.
        </p>

        <p>
          Please review our privacy information to understand how personal
          information may be collected, used, stored, and protected.
        </p>
      </>
    ),
  },
  {
    number: '15',
    title: 'Changes to These Terms',
    content: (
      <>
        <p>
          We may update these Terms & Conditions from time to time to reflect
          changes in our services, business practices, technology, or applicable
          legal requirements.
        </p>

        <p>
          Updated terms will be published on this page. Your continued use of
          the website after an update may constitute acceptance of the revised
          terms to the extent permitted by law.
        </p>
      </>
    ),
  },
  {
    number: '16',
    title: 'Governing Law & Jurisdiction',
    content: (
      <>
        <p>
          These Terms & Conditions shall be governed by the applicable laws of
          India.
        </p>

        <p>
          Any disputes arising in connection with these terms or the use of our
          website shall be subject to the jurisdiction of the courts having
          appropriate jurisdiction over the matter, subject to applicable law.
        </p>
      </>
    ),
  },
]

export default function Terms() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Page Header */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              Legal
            </p>

            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Please read these terms carefully before using the Vendrax
              website or placing an order.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/50">
              <span>Vendrax Pvt</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Last Updated: September 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 border border-border bg-white p-5 sm:p-6">
          <p className="text-sm leading-6 text-gray-600">
            These Terms & Conditions are intended to explain the general rules
            applicable to your use of the Vendrax website and purchases made
            through it. Please read them together with our other applicable
            policies.
          </p>
        </div>

        <div className="space-y-0 border-t border-border">
          {sections.map((section) => (
            <section
              key={section.number}
              className="grid gap-4 border-b border-border py-7 sm:grid-cols-[80px_220px_1fr] sm:gap-6 sm:py-9"
            >
              <div className="text-xs font-semibold tracking-[0.18em] text-accent">
                {section.number}
              </div>

              <h2 className="font-display text-lg font-semibold text-brand sm:text-xl">
                {section.title}
              </h2>

              <div className="space-y-3 text-sm leading-7 text-gray-600">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 border border-border bg-brand p-6 text-white sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Questions?
          </p>

          <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
            Need clarification about our terms?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            If you have questions about these Terms & Conditions or your order,
            our support team can help.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
          >
            Contact Us
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}