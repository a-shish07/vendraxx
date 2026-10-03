'use client'

import { useEffect, useState } from 'react'
import { useApp } from '../App'

export default function Checkout() {
  const { cart, cartTotal, clearCart, navigate, user } = useApp()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  })

  const [placing, setPlacing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [addresses, setAddresses] = useState<any[]>([])
  useEffect(() => {
    if (!user) return
    fetch('/api/addresses').then(r => r.ok ? r.json() : Promise.reject()).then(data => setAddresses(data.addresses || [])).catch(() => setAddresses([]))
  }, [user])

  const selectAddress = (id: string) => {
    const address = addresses.find(item => item.id === id)
    if (!address) return
    setForm(current => ({ ...current, name: address.fullName, phone: address.phone, address: [address.addressLine1, address.addressLine2, address.landmark].filter(Boolean).join(', '), city: address.city, state: address.state, pincode: address.pincode }))
  }

  const shipping = cartTotal >= 999 ? 0 : 79
  const total = cartTotal + shipping
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  const validate = () => {
    const e: Record<string, string> = {}

    if (!form.name.trim()) e.name = 'Please enter your name'

    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) {
      e.phone = 'Valid 10-digit phone required'
    }

    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Please enter a valid email'
    }

    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'

    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      e.pincode = 'Valid 6-digit pincode required'
    }

    return e
  }

  const handlePlaceOrder = async () => {
    const e = validate()

    if (Object.keys(e).length > 0) {
      setErrors(e)
      const firstKey = Object.keys(e)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (!user) {
      navigate(`/login?next=/checkout`)
      return
    }

    setErrors({})
    setPlacing(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
          customer: form,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to place order.')
      clearCart()
      navigate(`/account/orders/${data.order.id}`)
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to place order.' })
      setPlacing(false)
    }
  }

  /* -------------------------------------------------------------------------- */
  /* EMPTY STATE                                                                */
  /* -------------------------------------------------------------------------- */

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white border border-border flex items-center justify-center">
            <svg
              className="w-7 h-7 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-accent mb-2">
            Checkout
          </p>

          <h2 className="font-display text-3xl sm:text-4xl text-brand tracking-tight mb-3">
            Nothing to checkout
          </h2>

          <p className="text-sm text-slate-500 leading-relaxed mb-7">
            Your cart is empty. Add a few products and come back to complete
            your order.
          </p>

          <button
            onClick={() => navigate('products')}
            className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand/90 transition-all duration-300"
          >
            Browse Products

            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-white/45 mb-5">
            <button
              onClick={() => navigate('home')}
              className="hover:text-white transition-colors"
            >
              Home
            </button>

            <span>/</span>

            <button
              onClick={() => navigate('cart')}
              className="hover:text-white transition-colors"
            >
              Cart
            </button>

            <span>/</span>

            <span className="text-white/80">Checkout</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-px bg-accent" />

                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-accent">
                  Secure Checkout
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-tight">
                Complete your order
              </h1>

              <p className="text-white/55 text-sm mt-2 max-w-lg">
                Just a few details and your order will be ready for
                confirmation.
              </p>
            </div>

            {/* Compact progress */}
            <CheckoutProgress />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* ================================================================ */}
          {/* LEFT                                                             */}
          {/* ================================================================ */}

          <div className="lg:col-span-3 space-y-5">
            {/* -------------------------------------------------------------- */}
            {/* CONTACT                                                         */}
            {/* -------------------------------------------------------------- */}

            <CheckoutCard
              eyebrow="01"
              title="Contact Information"
              description="Details we'll use to reach you about your order."
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="field-name"
                  label="Full Name"
                  error={errors.name}
                  required
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={e =>
                      setForm(f => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Rahul Sharma"
                    className={inputClass(!!errors.name)}
                  />
                </Field>

                <Field
                  id="field-phone"
                  label="Phone Number"
                  error={errors.phone}
                  required
                  hint="Order confirmation"
                >
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
                      +91
                    </span>

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={e =>
                        setForm(f => ({
                          ...f,
                          phone: e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 10),
                        }))
                      }
                      placeholder="98765 43210"
                      className={`${inputClass(!!errors.phone)} pl-14`}
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  id="field-email"
                  label="Email Address"
                  error={errors.email}
                  hint="Optional"
                >
                  <input
                    type="email"
                    value={form.email}
                    onChange={e =>
                      setForm(f => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className={inputClass(!!errors.email)}
                  />
                </Field>
              </div>
            </CheckoutCard>

            {/* -------------------------------------------------------------- */}
            {/* ADDRESS                                                         */}
            {/* -------------------------------------------------------------- */}

            <CheckoutCard
              eyebrow="02"
              title="Delivery Address"
              description="Where should we deliver your order?"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            >
              {addresses.length > 0 && <label className="mb-4 block text-sm font-medium">Saved address<select defaultValue="" onChange={e => selectAddress(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3"><option value="">Enter a new address</option>{addresses.map(address => <option key={address.id} value={address.id}>{address.fullName} — {address.city}{address.isDefault ? ' (Default)' : ''}</option>)}</select></label>}
              <Field
                id="field-address"
                label="Street Address"
                error={errors.address}
                required
              >
                <input
                  type="text"
                  value={form.address}
                  onChange={e =>
                    setForm(f => ({ ...f, address: e.target.value }))
                  }
                  placeholder="House No. / Building / Street / Area"
                  className={inputClass(!!errors.address)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Field id="field-city" label="City" error={errors.city} required>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e =>
                      setForm(f => ({ ...f, city: e.target.value }))
                    }
                    placeholder="Mumbai"
                    className={inputClass(!!errors.city)}
                  />
                </Field>

                <Field
                  id="field-state"
                  label="State"
                  error={errors.state}
                  required
                >
                  <input
                    type="text"
                    value={form.state}
                    onChange={e =>
                      setForm(f => ({ ...f, state: e.target.value }))
                    }
                    placeholder="Maharashtra"
                    className={inputClass(!!errors.state)}
                  />
                </Field>

                <Field
                  id="field-pincode"
                  label="Pincode"
                  error={errors.pincode}
                  required
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        pincode: e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6),
                      }))
                    }
                    placeholder="400001"
                    className={inputClass(!!errors.pincode)}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  id="field-notes"
                  label="Order Notes"
                  hint="Optional"
                >
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={e =>
                      setForm(f => ({ ...f, notes: e.target.value }))
                    }
                    placeholder="Landmark, gate code, delivery instructions..."
                    className={`${inputClass(false)} resize-none`}
                  />
                </Field>
              </div>
            </CheckoutCard>

            {/* -------------------------------------------------------------- */}
            {/* PAYMENT                                                         */}
            {/* -------------------------------------------------------------- */}

            <CheckoutCard
              eyebrow="03"
              title="Payment Method"
              description="Choose how you'd like to pay."
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              }
            >
              {/* COD */}
              <div className="border border-accent/50 bg-accent/[0.04] rounded-xl p-4 flex items-start gap-3.5">
                <div className="w-4 h-4 mt-0.5 rounded-full border-[5px] border-accent bg-white flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-brand">
                      Cash on Delivery
                    </p>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                      Available
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pay when your order arrives. No advance payment required.
                  </p>
                </div>

                <span className="text-lg flex-shrink-0">💵</span>
              </div>

            </CheckoutCard>

            {/* -------------------------------------------------------------- */}
            {/* TRUST                                                           */}
            {/* -------------------------------------------------------------- */}

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: '🔒', label: 'Secure Order' },
                { icon: '🚚', label: '2–5 Day Delivery' },
                { icon: '↩️', label: '7-Day Returns' },
              ].map(item => (
                <div
                  key={item.label}
                  className="bg-white border border-border rounded-xl px-2 py-3 text-center hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="text-sm mb-1">{item.icon}</div>

                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT                                                            */}
          {/* ================================================================ */}

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* ------------------------------------------------------------ */}
              {/* SUMMARY                                                       */}
              {/* ------------------------------------------------------------ */}

              <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
                {/* Accent line */}
                <div className="h-1 bg-accent" />

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1">
                        Your order
                      </p>

                      <h2 className="font-display text-xl text-brand">
                        Order Summary
                      </h2>
                    </div>

                    <button
                      onClick={() => navigate('cart')}
                      className="text-xs font-semibold text-accent hover:text-brand transition-colors"
                    >
                      Edit cart
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-1"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-border flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />

                          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-brand line-clamp-2 leading-tight">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-1">
                            ₹{item.price.toLocaleString('en-IN')} each
                          </p>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-brand">
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            'en-IN',
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-5 pt-5 border-t border-border space-y-3">
                    <SummaryRow
                      label={
                        <>
                          Subtotal{' '}
                          <span className="text-slate-400">
                            ({itemCount} items)
                          </span>
                        </>
                      }
                      value={`₹${cartTotal.toLocaleString('en-IN')}`}
                    />

                    <SummaryRow
                      label="Shipping"
                      value={
                        shipping === 0
                          ? 'Free'
                          : `₹${shipping.toLocaleString('en-IN')}`
                      }
                      valueClass={
                        shipping === 0 ? 'text-emerald-600' : undefined
                      }
                    />

                    {shipping > 0 && (
                      <div className="bg-accent/[0.05] border border-accent/10 rounded-lg px-3 py-2.5">
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Add ₹
                          {(999 - cartTotal).toLocaleString('en-IN')} more to
                          unlock free shipping.
                        </p>
                      </div>
                    )}

                    <div className="pt-3 mt-2 border-t border-border flex items-end justify-between">
                      <div>
                        <p className="text-sm font-bold text-brand">Total</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Inclusive of all taxes
                        </p>
                      </div>

                      <p className="font-display text-2xl sm:text-3xl text-brand">
                        ₹{total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {errors.form && (
                    <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.form}</p>
                  )}

                  {/* Place order */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full mt-5 bg-accent text-brand py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/15 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {placing ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>

                        Placing order…
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>

                        Place Order
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-400 mt-3 leading-relaxed">
                    By placing this order you agree to our{' '}
                    <a href="#" className="text-accent hover:underline">
                      Terms
                    </a>{' '}
                    &{' '}
                    <a href="#" className="text-accent hover:underline">
                      Privacy Policy
                    </a>
                  </p>

                  {/* Trust */}
                  <div className="mt-5 pt-5 border-t border-border space-y-2.5">
                    <TrustLine text="Your data is safe & never shared" />
                    <TrustLine text="Order confirmed within minutes" />
                    <TrustLine text="Handpicked quality guarantee" />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* HELP                                                          */}
              {/* ------------------------------------------------------------ */}

              <div className="bg-brand rounded-2xl p-4.5 sm:p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Need help?</p>

                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Our team is available Mon–Sat, 9 AM – 7 PM IST.
                    </p>

                    <a
                      href="/contact"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-white mt-2 transition-colors"
                    >
                      Chat with us

                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes checkoutFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CHECKOUT PROGRESS                                                          */
/* -------------------------------------------------------------------------- */

function CheckoutProgress() {
  const steps = [
    { label: 'Cart', done: true },
    { label: 'Details', active: true },
    { label: 'Confirm' },
  ]

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto lg:min-w-[310px]">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className="flex items-center gap-2 flex-1 last:flex-none"
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                step.done
                  ? 'bg-accent text-brand'
                  : step.active
                    ? 'bg-white text-brand'
                    : 'bg-white/10 text-white/40'
              }`}
            >
              {step.done ? '✓' : index + 1}
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-semibold ${
                step.active ? 'text-white' : 'text-white/40'
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="h-px flex-1 bg-white/15 ml-1" />
          )}
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CHECKOUT CARD                                                              */
/* -------------------------------------------------------------------------- */

function CheckoutCard({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.025)]">
      <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-accent tracking-widest">
              {eyebrow}
            </span>

            <h2 className="font-display text-[17px] text-brand leading-tight">
              {title}
            </h2>
          </div>

          <p className="text-[11px] text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
}: {
  id?: string
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div id={id}>
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <label className="text-[10px] font-bold text-brand uppercase tracking-[0.14em]">
          {label}

          {required && <span className="text-accent ml-1">*</span>}
        </label>

        {hint && !error && (
          <span className="text-[9px] text-slate-400 font-medium">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>

          {error}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SUMMARY ROW                                                                */
/* -------------------------------------------------------------------------- */

function SummaryRow({
  label,
  value,
  valueClass = '',
}: {
  label: React.ReactNode
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>

      <span className={`font-semibold text-brand ${valueClass}`}>
        {value}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TRUST LINE                                                                 */
/* -------------------------------------------------------------------------- */

function TrustLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
      <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-3 h-3 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <span>{text}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INPUT STYLES                                                               */
/* -------------------------------------------------------------------------- */

const inputClass = (hasError: boolean) =>
  `w-full px-3.5 py-2.75 rounded-xl border bg-slate-50/50 text-brand placeholder-slate-400 text-sm outline-none transition-all duration-200
  ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30'
      : 'border-border focus:border-accent focus:ring-4 focus:ring-accent/10 focus:bg-white hover:border-slate-300'
  }`
