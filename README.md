# Duwitpedia

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0.1-green)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.16.3-blue)](https://postgresql.org/)

Duwitpedia is a modern financial management application that helps you track expenses, manage budgets, and gain powerful financial insights with intuitive analytics and reports.

## ✨ Key Features

### 👤 Authentication & Users
- **Google OAuth Login** - Quick and secure authentication
- **Demo Login** - Try the app with demo account
- **Role-based Access** - Admin and User with different access rights
- **Session Management** - Secure session handling

### 💰 Financial Management
- **Multi-Account Support** - Manage multiple financial accounts
- **Wallet Management** - Create and manage digital wallets
- **Transaction Tracking** - Record income, expenses, and transfers
- **Category Management** - Group transactions by categories

### 📊 Analytics & Reports
- **Financial Dashboard** - Real-time financial summary
- **Interactive Charts** - Data visualization with Chart.js
- **Financial Health Reports** - Financial health analysis
- **Category Insights** - Insights based on categories
- **Wallet Reports** - Reports per wallet

### 🛠️ Admin Features
- **Admin Dashboard** - Complete control panel
- **User Management** - Manage application users
- **Subscription Management** - PRO/FREE subscription system
- **Approval System** - Approval system for premium features

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animations and transitions
- **Radix UI** - Accessible UI components

### Backend & Database
- **NextAuth.js 4** - Authentication & authorization
- **Prisma 7** - Database ORM
- **PostgreSQL** - Relational database
- **Prisma Postgres Adapter** - Database connection

### Libraries & Tools
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching & caching
- **Chart.js** - Data visualization
- **Lucide React** - Icon library
- **Date-fns** - Date utilities
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### 1. Clone Repository
```bash
git clone https://github.com/nandaiqbalh/duwitpedia-web.git
cd duwitpedia
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create `.env.local` file in root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/duwitpedia"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional for production)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Demo Credentials
DEMO_EMAIL="demo@duwitpedia.com"
DEMO_PASSWORD="demo123"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with demo data
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
duwitpedia/
├── app/                    # Next.js App Router
│   ├── (user)/            # Protected user routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── login/             # Authentication pages
│   └── page.js            # Landing page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── accounts/         # Account-related components
│   ├── transactions/     # Transaction components
│   ├── dashboard/        # Dashboard widgets
│   └── landing/          # Landing page components
├── lib/                  # Utility libraries
│   ├── prisma.js         # Prisma client
│   ├── auth.js           # Authentication config
│   └── utils.js          # Helper functions
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   ├── seed-actual.ts    # Database seeding
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## 🤝 Contributing

We welcome contributions! Here's how to contribute to this project:

### 1. Fork Repository
Fork this repository to your GitHub account.

### 2. Clone Fork
```bash
git clone https://github.com/nandaiqbalh/duwitpedia-web.git
cd duwitpedia
```

### 3. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fix
git checkout -b fix/bug-description
```

### 4. Install Dependencies & Setup
Follow steps 2-4 from Quick Start above.

### 5. Make Changes
- Ensure code follows existing style guide
- Add tests if needed
- Update documentation if API changes

### 6. Commit Changes
```bash
git add .
git commit -m "feat: add [feature name]"
# or
git commit -m "fix: fix [bug description]"
```

### 7. Push to Branch
```bash
git push origin feature/your-feature-name
```

### 8. Create Pull Request
1. Open the original repository on GitHub
2. Click "New Pull Request"
3. Select your branch as compare
4. Fill PR description with change details
5. Tag appropriate reviewers

### Commit Guidelines
We use [Conventional Commits](https://conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding/changing tests
- `chore:` - Other changes

## 🐛 Reporting Issues

### Before Creating Issue
1. **Check Existing Issues** - Make sure issue hasn't been reported
2. **Update Dependencies** - Ensure using latest versions
3. **Check Documentation** - Read README and related docs

### How to Create Issue
1. **Bug Report** - Use bug report template
2. **Feature Request** - Use feature request template
3. **Question** - Use question template

### Bug Report Template
```markdown
**Bug Description**
Brief and clear description of the bug

**Reproduction Steps**
1. Open page '...'
2. Click button '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If possible, add screenshots

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node Version: [e.g. 18.17.0]
- Database: [e.g. PostgreSQL 15]
```

## 📄 License

This project uses MIT license. See `LICENSE` file for more details.

## 📞 Contact

- **Author**: Nanda Iqbal Hanafi
- **Email**: nandaiqbalhanafii@gmail.com
- **GitHub**: [@nandaiqbalh](https://github.com/nandaiqbalh)

## 🙏 Acknowledgments

Thanks to:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://radix-ui.com/) - UI components
- [Chart.js](https://chartjs.org/) - Chart library

---

**⭐ If you like this project, don't forget to give it a star on GitHub!**


