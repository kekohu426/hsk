# ChineseMaster - Environment Setup Guide

This guide will help you set up the ChineseMaster HSK learning platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## 🔑 Required Third-Party Services

You'll need accounts for these services:

1. **Vercel** ([Sign up](https://vercel.com/signup))
   - For hosting and PostgreSQL database

2. **Upstash** ([Sign up](https://upstash.com/))
   - For Redis (task queue)

3. **智谱AI (GLM)** ([Sign up](https://open.bigmodel.cn/))
   - For AI content generation

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
cd /Users/keko/Downloads/chinese-learning-platform
```

### Step 2: Install Dependencies

#### Install Backend Dependencies
```bash
npm install
```

#### Install Admin Frontend Dependencies
```bash
cd admin
npm install
cd ..
```

### Step 3: Set Up Environment Variables

Copy the template file:
```bash
cp .env.template .env
```

Edit `.env` and fill in the required values:

```env
# ========================================
# Database Configuration (from Vercel Postgres)
# ========================================
DATABASE_URL="postgresql://username:password@host:5432/dbname?sslmode=require"
POSTGRES_PRISMA_URL="postgresql://username:password@host:5432/dbname?pgbouncer=true&sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:5432/dbname?sslmode=require"

# ========================================
# JWT Configuration
# ========================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-generated-secret-here"
JWT_EXPIRES_IN="7d"

# ========================================
# GLM AI Configuration
# ========================================
GLM_API_KEY="your-glm-api-key-from-bigmodel"
GLM_MODEL="glm-4-flash"
GLM_API_BASE_URL="https://open.bigmodel.cn/api/paas/v4"

# ========================================
# Redis Configuration (from Upstash)
# ========================================
REDIS_URL="redis://default:password@hostname.upstash.io:6379"

# ========================================
# Admin Account
# ========================================
ADMIN_EMAIL="admin@example.com"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-here"

# ========================================
# Application Configuration
# ========================================
NODE_ENV="development"
PORT="3000"
BASE_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
```

### Step 4: Set Up Database

#### Generate Prisma Client
```bash
npm run prisma:generate
```

#### Push Schema to Database
```bash
npm run prisma:push
```

Or create a migration:
```bash
npm run prisma:migrate
```

#### Seed Initial Data
```bash
npm run prisma:seed
```

This will create:
- 10 achievements
- 1 AI configuration
- Admin user (credentials from .env)
- Test user (test@example.com / test123456)

### Step 5: Verify Database Setup

Open Prisma Studio to view your database:
```bash
npm run prisma:studio
```

This will open a web interface at `http://localhost:5555` where you can:
- View all tables
- Check seeded data
- Manually add/edit records

## 🧪 Testing the Setup

### Test Backend API
```bash
# Start the backend server
npm run dev
```

Visit `http://localhost:3000/health` - you should see:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "environment": "development"
}
```

### Test Admin Frontend
```bash
# In a new terminal
npm run admin:dev
```

Visit `http://localhost:5173` - the admin login page should load.

## 📁 Project Structure Overview

```
chinese-learning-platform/
├── api/                      # Backend Express.js API
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middleware
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   │   ├── ai/              # AI generation services
│   │   ├── seo/             # SEO & HTML generation
│   │   └── storage/         # File storage services
│   ├── utils/               # Utility functions
│   ├── workers/             # BullMQ worker processes
│   └── server.js            # Main server file
├── admin/                   # React admin frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API client services
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── package.json
├── prisma/                  # Database schema & migrations
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Seed data script
├── public/                  # Static files
│   ├── word/                # Generated word HTML files
│   └── article/             # Generated article HTML files
├── 开发文档/                 # Development documentation
│   ├── 00-总览和快速开始.md
│   ├── 01-数据库设计.md
│   ├── 02-后端API设计.md
│   ├── 03-AI生成系统.md
│   ├── 04-任务队列系统.md
│   ├── 05-静态HTML生成器.md
│   ├── 06-用户端改造方案.md
│   ├── 07-管理后台开发.md
│   └── 08-部署配置.md
├── *.html                   # User frontend HTML prototypes
├── styles.css              # User frontend styles
├── app.js                  # User frontend logic
├── .env                    # Environment variables (create from .env.template)
├── .env.template           # Environment template
├── package.json            # Backend dependencies
└── README.md               # Project overview
```

## 🔧 Common Issues & Solutions

### Issue: "Cannot find module '@prisma/client'"
**Solution:** Run `npm run prisma:generate`

### Issue: "DATABASE_URL is not set"
**Solution:** Make sure you've created `.env` file and filled in DATABASE_URL

### Issue: "JWT_SECRET is not set"
**Solution:** Generate a secret key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Issue: Prisma migration fails
**Solution:**
1. Check DATABASE_URL is correct
2. Make sure database is accessible
3. Try `npm run prisma:push` instead of migrate

## 📚 Next Steps

After completing the setup, you can:

1. **Start Development**: Follow the iterative development plan in [00-总览和快速开始.md](./开发文档/00-总览和快速开始.md)

2. **Read Documentation**:
   - [01-数据库设计.md](./开发文档/01-数据库设计.md) - Database schema details
   - [02-后端API设计.md](./开发文档/02-后端API设计.md) - API endpoints specifications

3. **Build Features**: Start with Iteration 1 (MVP):
   - User authentication
   - Word viewing
   - Basic learning functionality

## 🆘 Need Help?

- Check the development documents in `开发文档/` directory
- Review the `.env.template` file for all available configuration options
- Ensure all third-party services (Vercel, Upstash, GLM) are properly configured

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Admin dependencies installed (`cd admin && npm install`)
- [ ] Vercel Postgres database created
- [ ] Upstash Redis instance created
- [ ] GLM API key obtained
- [ ] `.env` file created and configured
- [ ] Prisma client generated (`npm run prisma:generate`)
- [ ] Database schema pushed (`npm run prisma:push`)
- [ ] Initial data seeded (`npm run prisma:seed`)
- [ ] Backend server starts successfully (`npm run dev`)
- [ ] Admin frontend starts successfully (`npm run admin:dev`)
- [ ] Prisma Studio accessible (`npm run prisma:studio`)

Once all items are checked, you're ready to start development! 🎉
