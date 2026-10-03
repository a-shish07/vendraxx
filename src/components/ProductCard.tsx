'use client'

import {
  useEffect,
  useState,
  type MouseEvent,
} from 'react'
import { useApp } from '../App'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const SearchIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
)

const HeartIcon = ({
  filled = false,
  className = 'h-4 w-4',
}: {
  filled?: boolean
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.8 8.9c0 5.5-8.8 10.1-8.8 10.1S3.2 14.4 3.2 8.9A5 5 0 0 1 12 6.1a5 5 0 0 1 8.8 2.8Z" />
  </svg>
)

const CartIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
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
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

const MinusIcon = ({
  className = 'h-3.5 w-3.5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
  </svg>
)

const PlusIcon = ({
  className = 'h-3.5 w-3.5',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const CheckIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12.5 4 4L19 7" />
  </svg>
)

const ChevronLeftIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

/* -------------------------------------------------------------------------- */
/* Product Card                                                               */
/* -------------------------------------------------------------------------- */

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
  } = useApp()

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [quickView, setQuickView] = useState(false)

  const [selectedImage, setSelectedImage] =
    useState(
      product.images?.[0] || product.image,
    )

  const [modalImageIndex, setModalImageIndex] =
    useState(0)

  const isWishlisted = wishlist?.some(
    (item: Product) => item.id === product.id,
  )

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image]

  /* ------------------------------------------------------------------------ */
  /* Quick View scroll lock                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!quickView) return

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setQuickView(false)
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [quickView])

  /* ------------------------------------------------------------------------ */
  /* Add to cart                                                              */
  /* ------------------------------------------------------------------------ */

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product)
    }

    setAdded(true)

    window.setTimeout(() => {
      setAdded(false)
    }, 1400)
  }

  /* ------------------------------------------------------------------------ */
  /* Wishlist                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleWishlist = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
    toggleWishlist(product)
  }

  /* ------------------------------------------------------------------------ */
  /* Quick View                                                               */
  /* ------------------------------------------------------------------------ */

  const openQuickView = (
    event?: MouseEvent<HTMLButtonElement>,
  ) => {
    event?.stopPropagation()

    setSelectedImage(images[0])
    setModalImageIndex(0)
    setQuickView(true)
  }

  const closeQuickView = () => {
    setQuickView(false)
  }

  const changeModalImage = (direction: number) => {
    const nextIndex =
      (modalImageIndex + direction + images.length) %
      images.length

    setModalImageIndex(nextIndex)
    setSelectedImage(images[nextIndex])
  }

  return (
    <>
      {/* ================================================================== */}
      {/* PRODUCT CARD                                                       */}
      {/* ================================================================== */}

      <article
        onClick={() => openQuickView()}
        className="
          group
          relative
          flex
          h-full
          min-w-0
          cursor-pointer
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          transition-all
          duration-200

          hover:-translate-y-0.5
          hover:border-slate-300
          hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]
        "
      >
        {/* IMAGE */}
        <div
          className="
            relative
            aspect-square
            overflow-hidden
            bg-[#f7f8fa]
          "
        >
          <img
            src={product.image}
            alt={product.name}
            className="
              h-full
              w-full
              object-contain
              p-4
              transition-transform
              duration-300

              group-hover:scale-[1.04]

              sm:p-5
            "
          />

          {/* Category */}
          <span
            className="
              absolute
              left-2.5
              top-2.5
              max-w-[62%]
              truncate
              rounded-md
              bg-white/90
              px-2
              py-1
              text-[7px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-slate-500
              shadow-sm
              backdrop-blur-sm

              sm:text-[8px]
            "
          >
            {product.category}
          </span>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            className="
              absolute
              right-2.5
              top-2.5
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/95
              text-slate-500
              shadow-sm
              transition-all

              hover:text-accent
              hover:shadow-md
            "
          >
            <HeartIcon
              filled={Boolean(isWishlisted)}
              className="h-[15px] w-[15px]"
            />
          </button>

          {/* Desktop Quick View */}
          <button
            type="button"
            onClick={openQuickView}
            className="
              absolute
              bottom-2.5
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-1.5
              rounded-lg
              bg-brand
              px-3
              py-2
              text-[10px]
              font-semibold
              text-white
              opacity-0
              shadow-lg
              transition-all

              group-hover:flex
              group-hover:opacity-100

              lg:flex
            "
          >
            <SearchIcon className="h-3 w-3" />
            Quick View
          </button>

          {/* Mobile Quick View */}
          <button
            type="button"
            onClick={openQuickView}
            className="
              absolute
              bottom-2
              left-2
              flex
              items-center
              gap-1
              rounded-md
              bg-white/95
              px-2
              py-1.5
              text-[8px]
              font-semibold
              text-brand
              shadow-sm

              lg:hidden
            "
          >
            <SearchIcon className="h-3 w-3" />
            View
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex
            flex-1
            flex-col
            p-2.5

            sm:p-3
          "
        >
          {/* Product name */}
          <h3
            className="
              line-clamp-2
              min-h-[1.35rem]
              text-[12px]
              font-semibold
              leading-[1.18rem]
              text-brand
              transition-colors

              group-hover:text-accent

              sm:min-h-[1.5rem]
              sm:text-[15px]
              sm:leading-[1.25rem]
            "
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="">
            <span
              className="
                text-[17px]
                font-bold
                tracking-tight
                text-brand

                sm:text-lg
              "
            >
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Actions */}
          <div
            className="
              mt-auto
              flex
              gap-1.5
              pt-3
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Quantity */}
            <div
              className="
                flex
                h-8
                shrink-0
                items-center
                overflow-hidden
                rounded-lg
                border
                border-slate-200
                bg-slate-50

                sm:h-9
              "
            >
              <button
                type="button"
                onClick={() =>
                  setQty((value) =>
                    Math.max(1, value - 1),
                  )
                }
                className="
                  flex
                  h-full
                  w-6
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-brand

                  sm:w-7
                "
              >
                <MinusIcon />
              </button>

              <span
                className="
                  w-4
                  text-center
                  text-[10px]
                  font-bold
                  text-brand

                  sm:text-xs
                "
              >
                {qty}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQty((value) => value + 1)
                }
                className="
                  flex
                  h-full
                  w-6
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-brand

                  sm:w-7
                "
              >
                <PlusIcon />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`
                flex
                h-8
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1
                rounded-lg
                px-1.5
                text-[9px]
                font-bold
                transition

                sm:h-9
                sm:text-[10px]

                ${
                  added
                    ? 'bg-accent text-white'
                    : 'bg-brand text-white hover:bg-brand/90'
                }
              `}
            >
              {added ? (
                <>
                  <CheckIcon className="h-3 w-3" />
                  Added
                </>
              ) : (
                <>
                  <CartIcon className="h-3 w-3" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* ================================================================== */}
      {/* QUICK VIEW                                                         */}
      {/* ================================================================== */}

      {quickView && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-2
            backdrop-blur-sm

            sm:p-4
          "
          onClick={closeQuickView}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view of ${product.name}`}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              relative
              flex
              max-h-[94vh]
              w-full
              max-w-[900px]
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-[0_25px_80px_rgba(0,0,0,0.25)]

              lg:grid
              lg:grid-cols-[46%_54%]
            "
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="
                absolute
                right-2.5
                top-2.5
                z-30
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-white
                text-slate-500
                shadow-md
                transition

                hover:text-brand

                sm:right-3
                sm:top-3
              "
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            {/* ============================================================ */}
            {/* GALLERY                                                       */}
            {/* ============================================================ */}

            <div
              className="
                flex
                min-h-0
                flex-col
                bg-[#f7f8fa]
                p-3

                sm:p-4

                lg:p-5
              "
            >
              <div
                className="
                  relative
                  flex
                  min-h-[260px]
                  flex-1
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-white

                  sm:min-h-[330px]

                  lg:min-h-[430px]
                "
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="
                    h-full
                    max-h-[330px]
                    w-full
                    object-contain
                    p-7

                    sm:max-h-[390px]
                    sm:p-9

                    lg:max-h-[440px]
                    lg:p-10
                  "
                />

                {/* Image navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        changeModalImage(-1)
                      }
                      aria-label="Previous image"
                      className="
                        absolute
                        left-2
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-brand
                        shadow-md
                        transition
                        hover:scale-105
                      "
                    >
                      <ChevronLeftIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeModalImage(1)
                      }
                      aria-label="Next image"
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-brand
                        shadow-md
                        transition
                        hover:scale-105
                      "
                    >
                      <ChevronRightIcon />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div
                  className="
                    mt-2.5
                    flex
                    gap-2
                    overflow-x-auto
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => {
                        setSelectedImage(image)
                        setModalImageIndex(index)
                      }}
                      className={`
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        border
                        bg-white
                        transition

                        sm:h-16
                        sm:w-16

                        ${
                          selectedImage === image
                            ? 'border-brand ring-1 ring-brand/20'
                            : 'border-slate-200 hover:border-brand/30'
                        }
                      `}
                    >
                      <img
                        src={image}
                        alt=""
                        className="
                          h-full
                          w-full
                          object-contain
                          p-1.5
                        "
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* DETAILS                                                       */}
            {/* ============================================================ */}

            <div
              className="
                min-h-0
                overflow-y-auto
                p-5

                sm:p-6

                lg:p-7
              "
            >
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-accent
                  "
                >
                  {product.category}
                </span>
              </div>

              {/* Name */}
              <h2
                className="
                  mt-2
                  pr-7
                  font-display
                  text-2xl
                  font-medium
                  leading-tight
                  tracking-tight
                  text-brand

                  sm:text-[28px]
                "
              >
                {product.name}
              </h2>

              {/* Price */}
              <p
                className="
                  mt-3
                  text-[24px]
                  font-bold
                  tracking-tight
                  text-brand
                "
              >
                ₹{product.price.toLocaleString('en-IN')}
              </p>

              {/* Divider */}
              <div className="my-4 h-px bg-slate-200" />

              {/* Description */}
              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                  "
                >
                  Description
                </p>

                <p
                  className="
                    mt-2
                    text-[13px]
                    leading-5.5
                    text-slate-600

                    sm:text-sm
                    sm:leading-6
                  "
                >
                  {product.description}
                </p>
              </div>

              {/* Compact info */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-slate-50
                    px-2.5
                    py-2
                    text-[10px]
                    font-medium
                    text-slate-500
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Free shipping available
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-slate-50
                    px-2.5
                    py-2
                    text-[10px]
                    font-medium
                    text-slate-500
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Secure checkout
                </div>
              </div>

              {/* Purchase */}
              <div className="mt-5">
                <p
                  className="
                    mb-2
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                  "
                >
                  Quantity
                </p>

                <div className="flex gap-2">
                  {/* Quantity */}
                  <div
                    className="
                      flex
                      h-11
                      shrink-0
                      items-center
                      overflow-hidden
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setQty((value) =>
                          Math.max(
                            1,
                            value - 1,
                          ),
                        )
                      }
                      className="
                        flex
                        h-full
                        w-8
                        items-center
                        justify-center
                        text-slate-400
                        hover:text-brand
                      "
                    >
                      <MinusIcon />
                    </button>

                    <span
                      className="
                        w-7
                        text-center
                        text-sm
                        font-bold
                        text-brand
                      "
                    >
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQty((value) => value + 1)
                      }
                      className="
                        flex
                        h-full
                        w-8
                        items-center
                        justify-center
                        text-slate-400
                        hover:text-brand
                      "
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  {/* Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`
                      flex
                      h-11
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      text-sm
                      font-bold
                      transition

                      ${
                        added
                          ? 'bg-accent text-white'
                          : 'bg-brand text-white hover:bg-brand/90'
                      }
                    `}
                  >
                    {added ? (
                      <>
                        <CheckIcon />
                        Added
                      </>
                    ) : (
                      <>
                        <CartIcon />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Small footer */}
              <div
                className="
                  mt-5
                  border-t
                  border-slate-200
                  pt-3
                  text-center
                  text-[9px]
                  text-slate-400
                "
              >
                Quality products · Secure checkout · Easy
                returns
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}