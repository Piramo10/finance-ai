# 💰 Finance AI

A full-stack financial management platform designed to help users organize their finances, track transactions, manage accounts and categories, and gain insights into their financial behavior through data and AI.

The project is being developed as a modern monorepo, focusing on scalability, type safety, separation of responsibilities, and maintainable architecture.

## 🚀 Features

### 🔐 Authentication
- User registration
- Login with email and password
- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Persistent authentication session
- Logout

### 💳 Financial Management
- Account management
- Category management
- Transaction management
- Income and expense tracking
- Current balance calculation
- Financial summaries
- Transaction filtering

### 📊 Dashboard
- Current balance
- Total income
- Total expenses
- Spending by category
- Financial overview
- Interactive charts

### 🤖 AI Features

Planned AI capabilities include:

- Automatic transaction categorization
- Financial assistant/chat
- Spending analysis
- Expense predictions
- Balance forecasting
- Personalized financial insights

### 📄 Statement Import

Planned support for importing financial statements from:

- CSV
- OFX
- PDF

---

## 🏗️ Architecture

The project uses a monorepo architecture:

```text
finance-ai/
│
├── apps/
│   ├── api/              # Fastify REST API
│   └── web/              # Next.js frontend
│
├── packages/
│   ├── database/         # Prisma schema and database layer
│   ├── types/            # Shared TypeScript types
│   ├── auth/             # Shared authentication logic
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configurations
│
├── package.json
└── turbo.json
```

### Backend

The API is built with **Fastify**, using Prisma as the ORM and PostgreSQL as the database.

```text
Client
  │
  ▼
Next.js
  │
  │ HTTP / JWT
  ▼
Fastify API
  │
  ▼
Prisma
  │
  ▼
PostgreSQL
```

### Frontend

The web application is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS v4

The project also contains a local reusable UI component library to maintain consistency across the application.

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS v4

### Backend

- Node.js
- Fastify
- TypeScript
- JWT
- bcrypt

### Database

- PostgreSQL
- Prisma ORM
- Supabase

### Monorepo

- Turborepo
- npm workspaces

### UI

- Tailwind CSS
- Reusable component architecture
- Recharts *(planned)*

---

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM.

The current data model is centered around:

```text
User
 │
 ├── Accounts
 │
 ├── Categories
 │
 └── Transactions
```

The database is designed to support financial data isolation between users while maintaining relationships between accounts, categories and transactions.

---

## 🔒 Security

Security is an important part of the application architecture.

Current implementations include:

- Password hashing with bcrypt
- JWT-based authentication
- Protected API endpoints
- Environment variables for sensitive configuration
- User-based data access
- Input validation

Additional security improvements will be implemented before production deployment.

---

## 📡 API

The backend exposes authenticated endpoints for the application's financial resources.

Current functionality includes:

```text
POST   /auth/register
POST   /auth/login

GET    /dashboard

GET    /transactions
POST   /transactions
DELETE /transactions/:id
```

Additional CRUD endpoints for accounts, categories and transactions are planned.

---

## 🖥️ Frontend Routes

Current public routes:

```text
/login
/cadastro
```

Planned authenticated routes:

```text
/dashboard
/contas
/categorias
/transacoes
/metas
```

---

## ⚙️ Getting Started

### Requirements

Make sure you have installed:

- Node.js
- npm
- PostgreSQL or a Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/Piramo10/finance-ai.git

cd finance-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the required `.env` files based on the project's environment examples.

Example:

```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
```

Never commit real credentials or secrets to the repository.

### 4. Run Prisma

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

### 5. Start the development environment

```bash
npm run dev
```

The applications will be available locally through their configured development ports.

---

## 🧪 Development

The project is structured as a monorepo, allowing frontend, backend and shared packages to evolve independently while maintaining shared types and configurations.

Typical development workflow:

```text
Feature
  ↓
Shared Types
  ↓
API
  ↓
Database
  ↓
Frontend
  ↓
Integration Testing
```

---

## 📈 Roadmap

### Authentication
- [x] User registration
- [x] Login
- [x] Password hashing
- [x] JWT authentication
- [x] Protected API routes
- [ ] Logout
- [ ] Frontend route protection

### Dashboard
- [x] Initial financial calculations
- [ ] Complete dashboard UI
- [ ] Balance summary
- [ ] Income/expense charts
- [ ] Category analysis
- [ ] Date filters

### Financial Management
- [ ] Account CRUD
- [ ] Category CRUD
- [ ] Complete transaction CRUD
- [ ] Transaction editing
- [ ] Advanced filtering

### Import
- [ ] CSV import
- [ ] OFX import
- [ ] PDF statement extraction
- [ ] Automatic transaction processing

### AI
- [ ] Automatic categorization
- [ ] Financial chatbot
- [ ] Spending analysis
- [ ] Expense predictions
- [ ] Balance forecasting
- [ ] Personalized recommendations

### Financial Goals
- [ ] Create financial goals
- [ ] Track progress
- [ ] Goal analytics
- [ ] AI-powered recommendations

### Production
- [ ] Production database
- [ ] Environment configuration
- [ ] API security hardening
- [ ] Logging
- [ ] Monitoring
- [ ] CI/CD
- [ ] Deployment

---

## 🎯 Project Goals

Finance AI is being developed not only as a financial management application, but also as a practical software engineering project focused on:

- Scalable architecture
- REST API design
- Database modeling
- Authentication and authorization
- Type-safe development
- Monorepo architecture
- Reusable UI components
- Data visualization
- AI integration
- Production-ready practices

The long-term goal is to combine traditional financial management with AI-powered analysis to provide users with actionable insights into their financial behavior.

---

## 👨‍💻 Author

**Marcelo Piramo**

Software Engineering student focused on Full-stack Development, Backend Engineering and modern TypeScript applications.

GitHub: **[@Piramo10](https://github.com/Piramo10)**

---

## 📄 License

This project is currently intended for educational and portfolio purposes.
