'use client'

import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

/* -------------------------------------------------------------------------- */
/*  Config: edit these in one place                                           */
/* -------------------------------------------------------------------------- */

const EMAIL = 'vendraxpvt@gmail.com'
const LOCATION_LABEL = 'India' // TODO: add city / full address when the client shares it

const TOPICS = ['Order help', 'Product question', 'Returns & refunds', 'Something else']

const FAQS = [
  {
    q: 'How can I track my order?',
    a: 'Sign in and open Account → Order history to see the latest order status. Include your order number if you email us for help.',
  },
  {
    q: 'What is your returns process?',
    a: 'Contact us with your order number and the reason for the return. We will reply with the next steps and what to expect.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'Cash on Delivery is the only payment method currently available at checkout.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery timing depends on your location and the items in your order. Email us before ordering if you need a delivery estimate.',
  },
]

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const MailIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PinIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SendIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

const CheckIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth={2.4}>
    <path d="M5 13l4 4L19 7" />
  </svg>
)

const AlertIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4m0 4h.01" />
  </svg>
)

const ChevronIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth={2}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const WhatsAppIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const FacebookIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
)

const InstagramIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth={2}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const XIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Is support open right now? Mon–Sat, 9 AM – 7 PM IST. Computed on the client only. */
function isSupportOpen(): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const day = parts.find(p => p.type === 'weekday')?.value
  const hour = Number(parts.find(p => p.type === 'hour')?.value) % 24
  return day !== 'Sun' && hour >= 9 && hour < 19
}

const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand placeholder:text-slate-400 outline-none transition focus:ring-4'
const inputOk = 'border-border focus:border-accent focus:ring-accent/15'
const inputBad = 'border-red-400 focus:border-red-400 focus:ring-red-100'

/* -------------------------------------------------------------------------- */
/*  Small components                                                          */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="mb-0.5 text-sm text-white/55">{label}</p>
        <div className="font-medium text-white">{children}</div>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-brand">
          {label}
        </label>
        {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  )
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
  id,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
  id: string
}) {
  return (
    <div>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-brand transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent/20"
        >
          <span className="font-semibold">{q}</span>
          <ChevronIcon
            className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
              open ? 'rotate-180 text-accent' : ''
            }`}
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-prose px-6 pb-6 leading-relaxed text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    setOpen(isSupportOpen())
  }, [])

  const update = (key: 'name' | 'email' | 'message' | 'topic', value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Enter your name so we know who to reply to.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email address, like you@example.com.'
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = 'Add a few more details. Your message needs at least 10 characters.'
    return e
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const first = ['name', 'email', 'message'].find(k => errs[k])
      if (first) document.getElementById(`contact-${first}`)?.focus()
      return
    }
    setErrors({})
    setSending(true)
    try {
      const subject = `[Vendrax] ${form.topic}`
      const body = `Name: ${form.name.trim()}\nReply email: ${form.email.trim()}\nTopic: ${form.topic}\n\n${form.message.trim()}`
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', topic: TOPICS[0], message: '' })
    setSubmitted(false)
  }

  return (
    <div className="bg-white">
      {/* ------------------------------ Hero ------------------------------ */}
      <header className="relative overflow-hidden bg-brand">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              We're here to help
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
              Questions about an order, a product, or a return? Send us a message and a real person
              will reply, usually within one working day.
            </p>

            {open !== null && (
              <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  {open && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70 motion-safe:animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      open ? 'bg-green-400' : 'bg-slate-400'
                    }`}
                  />
                </span>
                {open
                  ? 'Support is online now'
                  : 'Support is offline. We reply when we open at 9 AM IST'}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------- Contact panel -------------------------- */}
      <section className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-brand/10 lg:grid-cols-5">
          {/* Left: details */}
          <aside className="relative overflow-hidden bg-brand p-8 text-white sm:p-10 lg:col-span-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
            />
            <div className="relative flex h-full flex-col">
              <h2 className="font-display text-2xl">Contact information</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
                Send your question by email. The form opens a draft in your email application.
              </p>

              <div className="mt-9 space-y-6">
                <InfoRow icon={<MailIcon />} label="Email">
                  <a href={`mailto:${EMAIL}`} className="break-all transition-colors hover:text-accent">
                    {EMAIL}
                  </a>
                </InfoRow>

                <InfoRow icon={<ClockIcon />} label="Support hours">
                  Mon – Sat, 9 AM – 7 PM IST
                </InfoRow>

                <InfoRow icon={<PinIcon />} label="Location">
                  {LOCATION_LABEL}
                </InfoRow>
              </div>

              <div className="mt-auto pt-12">
                <p className="mb-3 text-sm text-white/55">Follow us</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Facebook', href: '#', icon: <FacebookIcon />, hover: 'hover:bg-accent hover:border-accent' },
                    { label: 'Instagram', href: '#', icon: <InstagramIcon />, hover: 'hover:bg-accent hover:border-accent' },
                    { label: 'X (Twitter)', href: '#', icon: <XIcon />, hover: 'hover:bg-accent hover:border-accent' },
                  ].map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 ${s.hover}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right: form */}
          <div className="p-8 sm:p-10 lg:col-span-3">
            {submitted ? (
              <div
                role="status"
                className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckIcon />
                </div>
                <h2 className="font-display text-3xl text-brand">Email draft opened</h2>
                <p className="mt-3 max-w-sm leading-relaxed text-slate-600">
                  Your email app should open with this message ready. Send the draft to complete your enquiry.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-brand sm:text-3xl">Send us a message</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Tell us what you need and we'll get back to you as soon as we can.
                  </p>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-brand">What is this about?</legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map(t => (
                      <label key={t} className="cursor-pointer">
                        <input
                          type="radio"
                          name="topic"
                          value={t}
                          checked={form.topic === t}
                          onChange={() => update('topic', t)}
                          className="peer sr-only"
                        />
                        <span className="inline-block rounded-full border border-border px-4 py-2 text-sm text-slate-600 transition-colors hover:border-accent hover:text-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-accent/20">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="contact-name" label="Your name" error={errors.name}>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="Rahul Sharma"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`${inputBase} ${errors.name ? inputBad : inputOk}`}
                    />
                  </Field>

                  <Field id="contact-email" label="Email address" error={errors.email}>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
                    />
                  </Field>
                </div>

                <Field
                  id="contact-message"
                  label="Your message"
                  error={errors.message}
                  hint={`${form.message.trim().length} characters`}
                >
                  <textarea
                    id="contact-message"
                    rows={6}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Include your order number if you have one."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={`${inputBase} resize-none ${errors.message ? inputBad : inputOk}`}
                  />
                </Field>

                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sending ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Sending
                      </>
                    ) : (
                      <>
                        Send message
                        <SendIcon />
                      </>
                    )}
                  </button>

                  <p className="text-xs leading-relaxed text-slate-400 sm:max-w-[16rem] sm:text-right">
                    We only use your details to reply to this message. Prefer email?{' '}
                    <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">
                      Write to us directly
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------ Map ------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="relative h-64 overflow-hidden rounded-3xl border border-border bg-surface sm:h-72">
          {/* TODO: swap this image for a Google Maps <iframe> once the client shares the address */}
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&h=500&fit=crop&auto=format"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex max-w-sm items-center gap-4 rounded-2xl bg-white p-4 shadow-xl sm:bottom-6 sm:left-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white">
              <PinIcon />
            </div>
            <div>
              <p className="font-semibold text-brand">Vendrax Pvt</p>
              <p className="text-sm text-slate-500">{LOCATION_LABEL}. We serve customers online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------- */}
      <section className="mt-20 bg-surface py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl text-brand sm:text-4xl">Quick answers</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-slate-600">
              These are the questions we get most. If yours isn't here, the form above reaches us
              directly.
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent">Email Vendrax support</a>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white lg:col-span-3">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                id={`faq-${i}`}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
