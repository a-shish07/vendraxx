'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

type Filter = 'all' | string

type Sort =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name'

const filterTabs = [
  {
    key: 'all',
    label: 'All Products',
    shortLabel: 'All',
  },
  {
    key: 'Mobile Accessories',
    label: 'Mobile Accessories',
    shortLabel: 'Mobile',
  },
  {
    key: 'Computer Accessories',
    label: 'Computer Accessories',
    shortLabel: 'Computer',
  },
  {
    key: 'Audio',
    label: 'Audio',
    shortLabel: 'Audio',
  },
  {
    key: 'Kitchen',
    label: 'Kitchen',
    shortLabel: 'Kitchen',
  },
  {
    key: 'Kitchen Appliances',
    label: 'Kitchen Appliances',
    shortLabel: 'Appliances',
  },
  {
    key: 'Home',
    label: 'Home',
    shortLabel: 'Home',
  },
  {
    key: 'Wearables',
    label: 'Wearables',
    shortLabel: 'Wearables',
  },
  {
    key: 'Gaming',
    label: 'Gaming',
    shortLabel: 'Gaming',
  },
  {
    key: 'Smartphones',
    label: 'Smartphones',
    shortLabel: 'Phones',
  },
  {
    key: 'Computers',
    label: 'Computers',
    shortLabel: 'Computers',
  },
  {
    key: 'Home Entertainment',
    label: 'Home Entertainment',
    shortLabel: 'Entertainment',
  },
  {
    key: 'Home Appliances',
    label: 'Home Appliances',
    shortLabel: 'Appliances',
  },
  {
    key:'Clothing',
    label:'Clothing',
    shortLabel:'Clothing',
  }
]

const sortOptions: {
  key: Sort
  label: string
}[] = [
  {
    key: 'featured',
    label: 'Featured',
  },
  {
    key: 'price-asc',
    label: 'Price: Low to High',
  },
  {
    key: 'price-desc',
    label: 'Price: High to Low',
  },
  {
    key: 'name',
    label: 'Name: A to Z',
  },
]

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const SearchIcon = ({
  className = 'h-5 w-5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
    strokeWidth={2}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
)

const CloseIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
    strokeWidth={2}
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

const ChevronDownIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const PackageIcon = ({
  className = 'h-5 w-5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
  >
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
  </svg>
)

const TruckIcon = ({
  className = 'h-5 w-5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
  >
    <path d="M3 5h11v11H3z" />
    <path d="M14 8h4l3 3v5h-7z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
)

const ShieldIcon = ({
  className = 'h-5 w-5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
  >
    <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const SparklesIcon = ({
  className = 'h-5 w-5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
  >
    <path d="m12 3 1.4 5.1L18 10l-4.6 1.9L12 17l-1.4-5.1L6 10l4.6-1.9L12 3Z" />
    <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
  </svg>
)

const ArrowRightIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    {...iconProps}
    strokeWidth={2}
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Products() {
const { products, loading } = useProducts()
const [filter, setFilter] = useState<Filter>('all')
const [search, setSearch] = useState('')
const [sort, setSort] = useState<Sort>('featured')
const [sortOpen, setSortOpen] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const initialized = useRef(false)
const skipInitialPageReset = useRef(true)

useEffect(() => {
  const savedCategory = sessionStorage.getItem('vendrax-product-category')
  const params = new URLSearchParams(window.location.search)
  const category = params.get('category')
  if (category) setFilter(category)
  else if (savedCategory) { setFilter(savedCategory); sessionStorage.removeItem('vendrax-product-category') }
  setSearch(params.get('search') || '')
  if (params.get('sort') === 'price-asc' || params.get('sort') === 'price-desc' || params.get('sort') === 'name') setSort(params.get('sort') as Sort)
  setCurrentPage(Math.max(1, Number(params.get('page') || 1)))
  initialized.current = true
}, [])

useEffect(() => {
  if (!initialized.current) return
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('category', filter)
  if (search.trim()) params.set('search', search.trim())
  if (sort !== 'featured') params.set('sort', sort)
  if (currentPage > 1) params.set('page', String(currentPage))
  const query = params.toString()
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
}, [filter, search, sort, currentPage])

useEffect(() => { if (skipInitialPageReset.current) { skipInitialPageReset.current = false; return }; setCurrentPage(1) }, [filter, search, sort])

  /* ------------------------------------------------------------------------ */
  /* Category counts                                                          */
  /* ------------------------------------------------------------------------ */

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: products.length,
    }

    products.forEach((product) => {
      result[product.category] =
        (result[product.category] || 0) + 1
    })

    return result
  }, [products])

  /* ------------------------------------------------------------------------ */
  /* Search + Category + Sorting                                              */
  /* ------------------------------------------------------------------------ */

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()

    const list = products.filter((product) => {
      const matchCategory =
        filter === 'all' ||
        product.category === filter

      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)

      return matchCategory && matchSearch
    })

    switch (sort) {
      case 'price-asc':
        return [...list].sort(
          (a, b) => a.price - b.price,
        )

      case 'price-desc':
        return [...list].sort(
          (a, b) => b.price - a.price,
        )

      case 'name':
        return [...list].sort((a, b) =>
          a.name.localeCompare(b.name),
        )

      default:
        return list
    }
  }, [products, filter, search, sort])

  /* ------------------------------------------------------------------------ */
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

  const hasActiveFilters =
    filter !== 'all' ||
    search.trim() !== '' ||
    sort !== 'featured'
  const pageSize = 24
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize))
  const pageProducts = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearAll = () => {
    setFilter('all')
    setSearch('')
    setSort('featured')
  }

  const selectedCategory =
    filterTabs.find((item) => item.key === filter)

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="relative overflow-hidden bg-brand">
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-[400px]
            w-[400px]
            rounded-full
            bg-accent/20
            blur-[100px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            h-[350px]
            w-[350px]
            rounded-full
            bg-white/[0.05]
            blur-[90px]
          "
        />

        {/* Subtle grid */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-4
            pb-24
            pt-10
            sm:px-6
            sm:pb-28
            sm:pt-14
            lg:px-8
            lg:pb-32
            lg:pt-18
          "
        >
          {/* Eyebrow */}
          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.07]
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-white/70
              backdrop-blur
              sm:text-xs
            "
          >
            <SparklesIcon className="h-3.5 w-3.5 text-accent" />
            Curated collection
          </div>

          <h1
            className="
              max-w-3xl
              font-display
              text-4xl
              font-medium
              leading-[1.05]
              tracking-tight
              text-white
              sm:text-5xl
              lg:text-6xl
          "
          >
            Everything you need,
            <br />
            <span className="text-white/50">
              beautifully selected.
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-white/60
              sm:mt-5
              sm:text-lg
              sm:leading-7
            "
          >
            Explore electronics, accessories, kitchen
            essentials and home products — all selected
            for everyday use.
          </p>

          {/* Benefits */}
          <div
            className="
              mt-7
              flex
              flex-wrap
              gap-x-5
              gap-y-2.5
              text-xs
              text-white/55
              sm:text-sm
            "
          >
            <div className="flex items-center gap-1.5">
              <TruckIcon className="h-4 w-4 text-accent" />
              Free shipping above ₹999
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 text-accent" />
              Secure checkout
            </div>

            <div className="flex items-center gap-1.5">
              <PackageIcon className="h-4 w-4 text-accent" />
              Quality products
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT                                                       */}
      {/* ================================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          pb-16
          sm:px-6
          sm:pb-20
          lg:px-8
        "
      >
        {/* ================================================================= */}
        {/* SEARCH + SORT                                                     */}
        {/* ================================================================= */}

        <section
          className="
            relative
            z-10
            -mt-10
            rounded-2xl
            border
            border-black/[0.06]
            bg-white
            p-3
            shadow-[0_14px_45px_rgba(15,23,42,0.09)]
            sm:-mt-12
            sm:p-4
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2.5
              sm:gap-3
              lg:flex-row
            "
          >
            {/* ------------------------------------------------------------- */}
            {/* Search                                                        */}
            {/* ------------------------------------------------------------- */}

            <div className="relative min-w-0 flex-1">
              <SearchIcon
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  h-4.5
                  w-4.5
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="product-search"
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-10
                  text-sm
                  font-medium
                  text-brand
                  outline-none
                  transition-all
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-brand/30
                  focus:bg-white
                  focus:ring-4
                  focus:ring-brand/[0.05]
                  sm:h-[50px]
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="
                    absolute
                    right-2.5
                    top-1/2
                    flex
                    h-7
                    w-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-200
                    hover:text-brand
                  "
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Sort                                                           */}
            {/* ------------------------------------------------------------- */}

            <div
              className="
                relative
                w-full
                lg:w-[210px]
                lg:shrink-0
              "
            >
              {/* Mobile label
              <span
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1.5
                  z-10
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                  lg:hidden
                "
              >
                Sort by
              </span> */}

             {/* ------------------------------------------------------------- */}
{/* CUSTOM SORT DROPDOWN                                          */}
{/* ------------------------------------------------------------- */}

<div className="relative w-full lg:w-[210px] lg:shrink-0">
  <button
    type="button"
    onClick={() => setSortOpen((prev) => !prev)}
    aria-haspopup="listbox"
    aria-expanded={sortOpen}
    className="
      flex
      h-12
      w-full
      items-center
      justify-between
      rounded-xl
      border
      border-slate-200
      bg-white
      px-3.5
      text-left
      outline-none
      transition

      hover:border-slate-300

      focus:border-brand/30
      focus:ring-4
      focus:ring-brand/[0.05]

      sm:h-[50px]
    "
  >
    <span className="min-w-0">
      {/* Mobile label */}
      <span
        className="
          block
          text-[8px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-slate-400
          lg:hidden
        "
      >
        Sort by
      </span>

      <span
        className="
          block
          truncate
          text-sm
          font-semibold
          leading-4
          text-brand
        "
      >
        {
          sortOptions.find(
            (option) => option.key === sort,
          )?.label
        }
      </span>
    </span>

    <ChevronDownIcon
      className={`
        h-4
        w-4
        shrink-0
        text-slate-400
        transition-transform
        duration-200
        ${sortOpen ? 'rotate-180' : ''}
      `}
    />
  </button>

  {sortOpen && (
    <>
      {/* Invisible backdrop */}
      <button
        type="button"
        aria-label="Close sort menu"
        className="fixed inset-0 z-30 cursor-default"
        onClick={() => setSortOpen(false)}
      />

      {/* Dropdown */}
      <div
        className="
          absolute
          left-0
          right-0
          top-[calc(100%+6px)]
          z-40
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1
          shadow-[0_12px_35px_rgba(15,23,42,0.14)]
        "
        role="listbox"
      >
        {sortOptions.map((option) => {
          const active = sort === option.key

          return (
            <button
              key={option.key}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                setSort(option.key)
                setSortOpen(false)
              }}
              className={`
                flex
                w-full
                items-center
                justify-between
                rounded-lg
                px-3
                py-2.5
                text-left
                text-sm
                transition

                ${
                  active
                    ? 'bg-brand text-white'
                    : 'text-brand hover:bg-slate-50'
                }
              `}
            >
              <span>{option.label}</span>

              {active && (
                <span className="text-xs text-white/70">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </>
  )}
</div>

              <ChevronDownIcon
                className="
                  pointer-events-none
                  absolute
                  right-3.5
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CATEGORIES                                                        */}
        {/* ================================================================= */}

        <section className="mt-9">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-accent
                "
              >
                Categories
              </p>

              <h2
                className="
                  mt-1
                  font-display
                  text-xl
                  font-medium
                  tracking-tight
                  text-brand
                  sm:text-2xl
                "
              >
                Shop by category
              </h2>
            </div>

            <span
              className="
                hidden
                text-xs
                font-medium
                text-slate-400
                sm:block
              "
            >
              {products.length} products
            </span>
          </div>

          {/* Compact horizontal categories */}
          <div
            className="
              -mx-1
              flex
              gap-2
              overflow-x-auto
              px-1
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {filterTabs.map((tab) => {
              const active = filter === tab.key
              const count = counts[tab.key] || 0

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  aria-pressed={active}
                  className={`
                    group
                    flex
                    h-11
                    shrink-0
                    items-center
                    gap-2
                    rounded-xl
                    border
                    px-3
                    transition-all
                    duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-accent/30

                    sm:h-12
                    sm:px-4

                    ${
                      active
                        ? 'border-brand bg-brand text-white shadow-sm'
                        : 'border-slate-200 bg-white text-brand hover:border-brand/20 hover:bg-slate-50'
                    }
                  `}
                >
                  {/* Category icon */}
                  <span
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-[9px]
                      font-bold
                      ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'bg-slate-100 text-brand'
                      }
                    `}
                  >
                    {tab.key === 'all'
                      ? '✦'
                      : tab.key
                          .split(' ')
                          .map(
                            (word) => word[0],
                          )
                          .slice(0, 2)
                          .join('')}
                  </span>

                  {/* Category name */}
                  <span className="text-left">
                    <span
                      className={`
                        block
                        whitespace-nowrap
                        text-xs
                        font-semibold
                        sm:text-sm
                        ${
                          active
                            ? 'text-white'
                            : 'text-brand'
                        }
                      `}
                    >
                      <span className="sm:hidden">
                        {tab.shortLabel}
                      </span>

                      <span className="hidden sm:inline">
                        {tab.label}
                      </span>
                    </span>
                  </span>

                  {/* Count */}
                  <span
                    className={`
                      rounded-full
                      px-1.5
                      py-0.5
                      text-[10px]
                      font-medium
                      ${
                        active
                          ? 'bg-white/10 text-white/70'
                          : 'bg-slate-100 text-slate-400'
                      }
                    `}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* RESULTS TOOLBAR                                                   */}
        {/* ================================================================= */}

        <section
          className="
            mt-6
            flex
            min-h-[48px]
            items-center
            justify-between
            gap-3
            border-b
            border-slate-200
            pb-4
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2.5
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-brand/[0.06]
                text-brand
              "
            >
              <PackageIcon className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-semibold
                  text-brand
                "
                aria-live="polite"
              >
                {visible.length}{' '}
                {visible.length === 1
                  ? 'product'
                  : 'products'}
              </p>

              <p
                className="
                  truncate
                  text-[11px]
                  text-slate-400
                "
              >
                {selectedCategory?.label ||
                  'All Products'}

                {search.trim()
                  ? ` · "${search.trim()}"`
                  : ''}
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="
                flex
                shrink-0
                items-center
                gap-1
                rounded-lg
                px-2
                py-1.5
                text-xs
                font-semibold
                text-accent
                transition
                hover:bg-accent/[0.06]
              "
            >
              <CloseIcon className="h-3 w-3" />

              <span className="hidden sm:inline">
                Clear filters
              </span>

              <span className="sm:hidden">
                Clear
              </span>
            </button>
          )}
        </section>

        {/* ================================================================= */}
        {/* ACTIVE FILTERS                                                    */}
        {/* ================================================================= */}

        {(search.trim() || filter !== 'all') && (
          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[11px]
                font-medium
                text-slate-400
              "
            >
              Active:
            </span>

            {/* Category filter */}
            {filter !== 'all' && (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="
                  inline-flex
                  max-w-full
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-brand/10
                  bg-brand/[0.04]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-brand
                  transition
                  hover:bg-brand/[0.08]
                "
              >
                <span className="truncate">
                  {selectedCategory?.label}
                </span>

                <CloseIcon className="h-3 w-3 shrink-0" />
              </button>
            )}

            {/* Search filter */}
            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="
                  inline-flex
                  max-w-full
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-brand/10
                  bg-brand/[0.04]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-brand
                  transition
                  hover:bg-brand/[0.08]
                "
              >
                <span className="max-w-[180px] truncate">
                  "{search.trim()}"
                </span>

                <CloseIcon className="h-3 w-3 shrink-0" />
              </button>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* PRODUCT GRID                                                      */}
        {/* ================================================================= */}

        {visible.length > 0 ? (
          <section className="mt-5">
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-2
                sm:gap-5
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {pageProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
            {totalPages > 1 && <nav aria-label="Product pages" className="mt-8 flex items-center justify-center gap-2"><button disabled={currentPage <= 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="px-3 text-sm text-slate-500">Page {currentPage} of {totalPages}</span><button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Next</button></nav>}
          </section>
        ) : (
          /* =============================================================== */
          /* EMPTY STATE                                                      */
          /* =============================================================== */

          <section
            className="
              mx-auto
              mt-10
              max-w-xl
              rounded-3xl
              border
              border-slate-200
              bg-white
              px-6
              py-14
              text-center
              shadow-sm
              sm:px-10
              sm:py-16
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-brand/[0.06]
                text-brand
              "
            >
              <SearchIcon className="h-7 w-7" />
            </div>

            <h2
              className="
                mt-6
                font-display
                text-2xl
                font-medium
                tracking-tight
                text-brand
              "
            >
              No products found
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
              "
            >
              {search.trim()
                ? `We couldn't find anything matching "${search.trim()}". Try a different search term.`
                : 'There are no products in this category yet. Explore another category.'}
            </p>

            <button
              type="button"
              onClick={clearAll}
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-brand
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-brand/15
                transition-all
                hover:-translate-y-0.5
                hover:bg-brand/90
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-brand/20
              "
            >
              Browse all products
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </section>
        )}
      </div>
    </main>
  )
}
