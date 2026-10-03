'use client'

import Link from 'next/link'

const sections = [
  {
    number: '01',
    title: 'Policy Overview',
    content: (
      <>
        <p>
          At Vendrax Pvt., we aim to provide customers with a smooth and
          reliable shopping experience. This Refund & Cancellation Policy
          explains the circumstances under which an order may be cancelled,
          returned, or refunded.
        </p>

        <p>
          Refund eligibility may depend on the product, order status, condition
          of the item, reason for the request, and applicable laws.
        </p>
      </>
    ),
  },
  {
    number: '02',
    title: 'Order Cancellation',
    content: (
      <>
        <p>
          Customers may request cancellation of an order as soon as possible
          after placing it.
        </p>

        <p>
          Cancellation requests can generally be considered only while the
          order has not reached a stage where fulfilment or dispatch can no
          longer be stopped.
        </p>

        <p>
          Once an order has been dispatched, cancellation may no longer be
          possible. In such cases, please contact our support team for
          assistance.
        </p>
      </>
    ),
  },
  {
    number: '03',
    title: 'When a Refund May Be Provided',
    content: (
      <>
        <p>
          Subject to applicable conditions, a refund may be considered in
          situations such as:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>An order is cancelled and the cancellation is accepted.</li>
          <li>
            A product is unavailable after an order has been successfully
            placed.
          </li>
          <li>
            The wrong product has been delivered and the issue is verified.
          </li>
          <li>
            A product arrives damaged or defective and the claim is accepted.
          </li>
          <li>
            A refund is otherwise required under applicable law or our
            applicable product-specific policy.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: '04',
    title: 'Damaged or Defective Products',
    content: (
      <>
        <p>
          If you receive a product that appears damaged or defective, please
          contact us as soon as reasonably possible after delivery.
        </p>

        <p>
          To help us investigate the issue, we may request photographs, videos,
          packaging information, order details, or other relevant information.
        </p>

        <p>
          The resolution may include replacement, return, refund, or another
          appropriate solution depending on the circumstances and applicable
          policy.
        </p>
      </>
    ),
  },
  {
    number: '05',
    title: 'Wrong Product Received',
    content: (
      <>
        <p>
          If you receive a product different from the product ordered, please
          contact our support team promptly and provide your order information.
        </p>

        <p>
          After verification, we may arrange an appropriate resolution,
          including replacement or refund where applicable.
        </p>
      </>
    ),
  },
  {
    number: '06',
    title: 'Missing or Incomplete Items',
    content: (
      <>
        <p>
          If an order is delivered with missing items or an incorrect quantity,
          please report the issue to our support team as soon as possible.
        </p>

        <p>
          We may verify the order, packing information, delivery records, and
          other relevant details before determining the appropriate resolution.
        </p>
      </>
    ),
  },
  {
    number: '07',
    title: 'Products That Cannot Be Returned',
    content: (
      <>
        <p>
          Certain products may not be eligible for return because of their
          nature, hygiene or safety considerations, regulatory requirements,
          product condition, or other legitimate reasons.
        </p>

        <p>
          Where applicable, product-specific return restrictions will be
          communicated on the relevant product page or during the purchase
          process.
        </p>

        <p>
          Products that have been used, altered, damaged after delivery, or
          otherwise fail applicable return conditions may not qualify for a
          refund or replacement.
        </p>
      </>
    ),
  },
  {
    number: '08',
    title: 'Return Conditions',
    content: (
      <>
        <p>
          Where a return is approved, the product may need to be returned in an
          appropriate condition along with its original packaging, accessories,
          labels, invoices, or other included items, where applicable.
        </p>

        <p>
          Customers should not send products back without first receiving
          return instructions from our support team.
        </p>
      </>
    ),
  },
  {
    number: '09',
    title: 'Refund Process',
    content: (
      <>
        <p>
          Once a cancellation, return, or refund request is approved, we will
          initiate the applicable refund process.
        </p>

        <p>
          For prepaid orders, refunds will generally be processed through the
          applicable payment method or payment service provider, subject to
          their processing procedures.
        </p>

        <p>
          The time taken for the refunded amount to appear in the customer's
          account may depend on the payment provider or bank.
        </p>
      </>
    ),
  },
  {
    number: '10',
    title: 'Cash on Delivery Orders',
    content: (
      <>
        <p>
          For Cash on Delivery orders, the refund method may differ from the
          original payment process because no online payment was collected at
          checkout.
        </p>

        <p>
          Where a refund is approved for a Cash on Delivery order, we may
          request the customer to provide appropriate bank account or other
          payment details required to process the refund.
        </p>

        <p>
          Customers should ensure that the refund information provided to us is
          accurate.
        </p>
      </>
    ),
  },
  {
    number: '11',
    title: 'Shipping Charges',
    content: (
      <>
        <p>
          Shipping and delivery charges may be treated differently depending
          on the reason for cancellation, return, or refund.
        </p>

        <p>
          Where the issue is caused by an incorrect product, verified damage,
          fulfilment error, or another circumstance for which we are
          responsible, the applicable resolution will be determined after
          reviewing the case.
        </p>

        <p>
          Charges associated with customer-requested returns or other
          non-qualifying situations may not be refundable where permitted by
          applicable law and the applicable order policy.
        </p>
      </>
    ),
  },
  {
    number: '12',
    title: 'Refund Timelines',
    content: (
      <>
        <p>
          Refund processing begins after the relevant cancellation, return, or
          refund request has been reviewed and approved.
        </p>

        <p>
          The final crediting time can vary depending on the payment method,
          bank, payment gateway, and other financial service providers involved
          in the transaction.
        </p>

        <p>
          If a refund has been confirmed by us but has not appeared after the
          expected processing period, please contact our support team with your
          order details.
        </p>
      </>
    ),
  },
  {
    number: '13',
    title: 'Incorrect Customer Information',
    content: (
      <>
        <p>
          We are not responsible for delays or failed deliveries caused by
          incorrect, incomplete, or outdated customer information, including
          incorrect delivery addresses or contact details.
        </p>

        <p>
          Customers should carefully review their information before confirming
          an order.
        </p>
      </>
    ),
  },
  {
    number: '14',
    title: 'Fraudulent or Abusive Claims',
    content: (
      <>
        <p>
          We reserve the right to investigate refund, return, replacement, and
          cancellation requests to prevent fraudulent or abusive activity.
        </p>

        <p>
          Where permitted by law, requests supported by misleading, false, or
          fraudulent information may be declined.
        </p>
      </>
    ),
  },
  {
    number: '15',
    title: 'How to Contact Us',
    content: (
      <>
        <p>
          To request a cancellation, report a damaged product, request a
          refund, or raise another order-related concern, please contact our
          support team with your order number and relevant details.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 mt-2 font-medium text-brand hover:text-accent transition-colors"
        >
          Contact Vendrax Support
          <span aria-hidden="true">→</span>
        </Link>
      </>
    ),
  },
]

export default function RefundPolicy() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Page Header */}
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              Customer Policy
            </p>

            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Refund & Cancellation Policy
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Information about order cancellation, returns, replacements and
              refunds at Vendrax.
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
        {/* Quick summary */}
        <div className="mb-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <div className="bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Cancellation
            </p>
            <p className="mt-2 text-sm font-medium text-brand">
              Request as early as possible
            </p>
          </div>

          <div className="bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Damaged Item
            </p>
            <p className="mt-2 text-sm font-medium text-brand">
              Report promptly after delivery
            </p>
          </div>

          <div className="bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Refund
            </p>
            <p className="mt-2 text-sm font-medium text-brand">
              Processing after approval
            </p>
          </div>
        </div>

        <div className="border-t border-border">
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

        {/* Support CTA */}
        <div className="mt-8 border border-border bg-brand p-6 text-white sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Need Help?
          </p>

          <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
            Have a question about your order?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Keep your order number ready and contact our support team. We will
            review your request and guide you through the applicable process.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
          >
            Contact Support
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}