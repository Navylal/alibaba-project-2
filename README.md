# PerfumeShop POS - Management System

Modern web-based Point of Sale system for perfume mixing shops, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛒 **Point of Sale (Kasir)** - Complete transaction processing with customer loyalty tracking
- 🧪 **Price Calculator** - Calculate HPP and selling price for perfume mixes
- 📦 **Stock Management** - Track materials, bottles, and finished products
- 👥 **Customer Management** - Loyalty program with automatic rewards
- 📊 **Dashboard** - Real-time business insights and analytics
- 🧪 **Tester Tracking** - Monitor waste costs from samples and testing
- 📈 **Reports** - Export business data to Excel

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router 7
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier works)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
pnpm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Name: PerfumeShop POS
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for the project to finish setting up (~2 minutes)

### 3. Setup Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `SUPABASE_SCHEMA.md` in this project
3. Copy ALL the SQL statements from the schema file
4. Paste them into the SQL Editor
5. Click "Run" to execute

This will create:
- All necessary tables (materials, bottles, customers, transactions, etc.)
- Row Level Security policies
- Triggers for automatic timestamps
- Sample data for testing

### 4. Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (starts with `https://...supabase.co`)
3. Copy your **anon/public** API key (starts with `eyJ...`)

### 5. Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run the Application

```bash
# Start development server
pnpm dev
```

The app will open at `http://localhost:5173`

## Default Login

After setup, you can login with:
- Any email/password combination (authentication is simplified for demo)
- The login will redirect you to `/dashboard`

## Usage Guide

### 1. Stock Management

**Add Materials & Bottles:**
- Navigate to **Stock** page
- Click "Add New Item"
- Fill in details (name, stock, price, threshold)
- Save to database

**Track Stock Levels:**
- Low stock items are automatically highlighted
- Separate tables for low stock and available stock
- Real-time stock updates after transactions

### 2. Price Calculator

**Create a Perfume Mix:**
1. Select bottle type (Roll On or Spray)
2. Choose bottle size
3. Search and add materials (autocomplete)
4. Adjust ml amounts for each ingredient
5. Set profit margin
6. View real-time HPP and selling price

**Save as Tester:**
- Click "Save as Tester" to track waste costs
- Automatically records materials used
- Updates tester history

### 3. Point of Sale (Kasir)

**Process a Transaction:**
1. Add products to cart
2. Search customer by phone (optional)
3. Apply loyalty discount if available
4. Click "Checkout"

**Loyalty Program:**
- Customers earn 1 point per transaction
- After 10 transactions → 10% discount reward
- Rewards auto-applied at checkout

### 4. Customer Management

- View all registered customers
- Track loyalty progress (0-10 scale)
- Monitor total spending and visit frequency
- Export customer data

### 5. Dashboard

Real-time business metrics:
- Sales and profit today
- Total transactions
- Low stock alerts
- Sales trend chart
- Recent transaction history

### 6. Tester Tracking

- View all test mixes and samples
- Calculate total waste cost
- Analyze cost per tester
- Monthly waste reports

## Database Structure

### Core Tables

- **materials** - Raw perfume materials (oils, extracts)
- **bottles** - Bottles and packaging
- **finished_products** - Ready-to-sell perfume products
- **customers** - Customer information and loyalty status
- **transactions** - Sales transactions
- **transaction_items** - Line items for each transaction
- **testers** - Test mixes and samples
- **tester_materials** - Materials used in each tester

See `SUPABASE_SCHEMA.md` for complete schema documentation.

## Common Issues & Solutions

### Issue: "Invalid credentials" error

**Solution**: Make sure your `.env` file has correct Supabase URL and anon key.

### Issue: Database returns empty data

**Solution**: 
1. Check if sample data was inserted (SQL Editor)
2. Verify RLS policies are enabled
3. Check browser console for errors

### Issue: Transactions not creating

**Solution**:
1. Ensure finished_products table has items
2. Check if stock quantities are > 0
3. Verify customer ID if using loyalty

### Issue: Calculator not showing materials

**Solution**:
1. Add materials in Stock Management first
2. Refresh the page
3. Check browser console for Supabase errors

## Development

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Stock.tsx
│   │   ├── Calculator.tsx
│   │   ├── Kasir.tsx
│   │   ├── Customers.tsx
│   │   ├── Tester.tsx
│   │   ├── Reports.tsx
│   │   └── Profile.tsx
│   ├── routes.tsx
│   └── App.tsx
├── hooks/
│   └── useSupabase.ts
├── lib/
│   └── supabase.ts
└── styles/
    ├── theme.css
    └── fonts.css
```

### Adding New Features

1. Create new table in Supabase (SQL Editor)
2. Add type definitions in `src/lib/supabase.ts`
3. Create hook in `src/hooks/useSupabase.ts`
4. Build UI component in `src/app/pages/`

### Customizing Theme

Edit `src/styles/theme.css` to change:
- Primary colors
- Font sizes
- Border radius
- Spacing

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Create netlify.toml
# Add build command: pnpm build
# Add environment variables in Netlify dashboard
```

## Security Notes

- Never commit `.env` file to git
- Use Row Level Security in Supabase
- Validate all inputs on frontend
- Implement proper authentication in production
- Use HTTPS in production

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for your business!

## Support

For issues and questions:
- Check `SUPABASE_SCHEMA.md` for database documentation
- Review browser console for errors
- Check Supabase dashboard logs
- Open an issue on GitHub

## Acknowledgments

- Built with [React](https://react.dev)
- Powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ for small perfume businesses
