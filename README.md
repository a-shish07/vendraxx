# Vendrax — Next.js + MongoDB

This is the Vendrax Vite/React storefront migrated to Next.js App Router and extended with customer authentication, MongoDB products/orders, order history, inventory-aware ordering, and an admin panel.

## What changed

- Vite + React Router removed; Next.js App Router is used for routing.
- MongoDB + Mongoose replace the missing/static `data/products` source.
- Customer registration/login/logout uses an HTTP-only signed session cookie.
- Roles: `CUSTOMER` and `ADMIN`.
- Customer account and order history pages added.
- Checkout creates an order on the server. No online payment integration is included.
- Product stock is checked and decremented when an order is placed.
- Admin dashboard, products, orders, customers, categories and analytics pages added.
- Admin can update order status and deactivate products.
- Existing storefront styling/components were retained as much as possible.

## Important source limitation

The uploaded Vite project did not include `src/data/products.ts` or the original product images. The migration therefore defines the MongoDB Product model and includes a small optional sample-product seed script. Your real catalogue should be imported into MongoDB before launch. If you have the original product-data/image files, copy them into this project or import the data through the admin panel.

## Setup

1. Install Node.js 20+.
2. Create a MongoDB Atlas database.
3. Copy `.env.example` to `.env.local` and set:

```env
MONGODB_URI=...
AUTH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`AUTH_SECRET` must contain at least 32 characters. Keep these values server side; do not add Cloudinary credentials to `NEXT_PUBLIC_*` variables. Cloudinary credentials are required for profile and product image uploads. The admin seed command also reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.

4. Install packages:

```bash
npm install
```

5. Start development:

```bash
npm run dev
```

6. Create an admin account by setting `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME`, then run:

```bash
npx tsx scripts/seed-admin.ts
```

7. Optional demo products:

```bash
npm run seed:products
```

Then open `/admin` after logging in with the seeded admin account.

## Main routes

- `/` storefront home
- `/products` catalogue
- `/products/[id]` product detail
- `/cart` cart
- `/checkout` COD/order checkout
- `/login`, `/register`
- `/account`, `/account/orders`, `/account/orders/[id]`
- `/admin`, `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/categories`, `/admin/analytics`

## Operations and validation

The application uses MongoDB transactions for order stock reservation and cancellation, so the database deployment must support transactions (MongoDB Atlas does). Product images are stored in Cloudinary and only URLs/public IDs are stored in MongoDB. Orders capture item prices and names so later product edits do not rewrite order history. `npm run lint` runs the TypeScript check; `npm run build` creates the production build.

Before launch, configure shared rate limiting for authentication and order endpoints, populate the real catalogue, review delivery/returns policies and contact details, and run customer/admin workflows against a disposable Atlas database. This checkout does not include an automated integration test suite or deployment specific secrets.

## Important migration note

Copy the existing Vendrax logo asset from the old project to `public/logo.png`. The uploaded migration source did not include the binary logo file, so it could not be packaged automatically.

The Next.js migration uses `href` with `next/link`; do not use React Router's `to` prop in migrated components.
