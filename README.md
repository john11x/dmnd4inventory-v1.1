# Inventory ML App

A full-stack inventory management application with role-based access, real-time analytics, and ML-powered demand predictions.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

**Demo Credentials:**
- Admin: `/admin/login` (any email/password works)
- User: `/login` (any email/password works)

## Features

### Authentication & Authorization
- Separate login UIs for admin (`/admin/login`) and users (`/login`)
- Role-based routing via middleware (ROLE_ADMIN, ROLE_USER)
- Cookie-based session persistence

### Admin Dashboard (`/admin/dashboard`)
- **Cards**: Total products, orders today, low stock count, predicted demand insights
- **Charts** (Recharts): Sales trends, top-selling products, demand predictions, inventory health
- **Real-time Alerts**: Low stock warnings with quick restock buttons

### Admin Features
- **Product Management** (`/admin/products`): CRUD with search & category filters
- **Inventory Management** (`/admin/inventory`): Stock tracking, color-coded status, restock functionality
- **Order Monitoring** (`/admin/orders`): Filterable orders table
- **ML Predictions** (`/admin/dashboard`): AI-powered demand forecasting and restock recommendations

### User Interface
- **Product Browsing** (`/user/home`): Grid with sorting & filters
- **Product Details** (`/user/product/:id`): Full info + quantity selector + order placement
- **Order History** (`/user/order`): Track past orders with status

## Project Structure

```
├── middleware.js                 # Role-based routing protection
├── app/
│   ├── admin/dashboard/         # Admin analytics dashboard
│   ├── admin/products/          # Product CRUD
│   ├── admin/inventory/         # Stock management
│   ├── admin/orders/            # Order monitoring
│   ├── admin/prediction/        # ML prediction panel
│   ├── user/home/               # Product grid
│   ├── user/product/[id]/       # Product details
│   ├── user/order/              # Order history
│   ├── components/
│   │   ├── ProtectedClient.jsx  # Role guard wrapper
│   │   ├── StatsCard.jsx
│   │   ├── LowStockAlert.jsx
│   │   └── charts/              # Recharts components
│   ├── providers/
│   │   └── AuthProvider.jsx     # Auth context + cookie mgmt
│   └── lib/api.js              # API helpers
```

## Environment

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Technology

- **Next.js 16**: App Router, Server Components, Middleware
- **React 19**: Hooks, Context
- **Tailwind CSS**: Styling
- **Recharts**: Interactive charts
- **Authentication**: Cookie + localStorage

## Deployment

### Vercel
```bash
vercel deploy
```

### Docker
```bash
docker build -t inventory-app .
docker run -p 3000:3000 inventory-app
```

## Current Status

✅ Authentication (separate admin/user login)
✅ Role-based routing (middleware + client guards)
✅ Admin dashboard with charts & alerts
✅ Product management (CRUD)
✅ Inventory tracking with restock
✅ Order monitoring
✅ ML prediction panel
✅ User product browsing & ordering

⚠️ **Note**: Currently uses mock data. Integrate real backend API by updating `/api` routes and `lib/api.js`.

## Next Steps

1. Connect backend API endpoints (currently mock)
2. Add real authentication (JWT/OAuth)
3. Integrate payment processing
4. Deploy to production
5. Add email notifications
6. Implement advanced ML models

For more info, see the inline component comments and API route stubs.
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
