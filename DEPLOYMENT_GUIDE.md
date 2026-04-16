# Deployment Guide - Kayan Materials MVP

## Pre-Deployment Checklist

### ✅ Configuration Setup
- [ ] Copy `.env.example` to `.env` in root, client/, and server/
- [ ] Update environment variables for your deployment target
- [ ] Verify `NODE_ENV=production` for production builds
- [ ] Update `FRONTEND_URL` to match your deployed domain

### ✅ Security
- [ ] Remove hardcoded credentials or secrets
- [ ] Enable HTTPS everywhere (handled by Netlify)
- [ ] Verify CORS is properly configured for your domain
- [ ] Check that database path is writable in your deployment environment

### ✅ Database
- [ ] SQLite file is included in `.gitignore` (good - database won't be committed)
- [ ] Database will be initialized on first server start (`synchronize: true`)
- [ ] Plan for database persistence strategy (see Database Persistence section)

---

## Deployment Architecture Options

### Option 1: Separate Deployments (Recommended for MVP → Production)
**Best for**: Scaling, different tech stacks for frontend/backend

```
Frontend: Netlify
Backend: Railway/Render/Heroku/AWS
Database: PostgreSQL (cloud-hosted)
```

**Pros:**
- Independent scaling
- Better for production
- Standard microservices approach

**Cons:**
- More complex setup
- Multiple deployments

### Option 2: Monorepo with Netlify Functions
**Best for**: Simple MVPs, tight integration

```
Everything: Netlify
- Client: Static SPA deployed to CDN
- API: Netlify Functions (serverless)
- Database: External service (Neon, Supabase, etc.)
```

**Pros:**
- Single deployment pipeline
- Unified hosting

**Cons:**
- Serverless cold starts
- SQLite won't work (no persistent filesystem)

### Option 3: Monorepo with Custom Server (NOT Netlify compatible)
**For**: DigitalOcean, Railway, Render, etc.

```
Same repo structure, both apps run continuously
Frontend: Built & served as static files
Backend: Express server on its own port
```

---

## API Communication: /api Prefix Routing

### Current Setup (Development)
All API endpoints are prefixed with `/api/` for security and organization:
```typescript
// Client API files use /api prefix
const API_URL = '/api/materials'
axios.get(`/api/suppliers`)

// Server routes are also prefixed with /api
app.use('/api/materials', materialRouter)
app.use('/api/suppliers', supplierRouter)
```

### How It Works

#### Development (Vite Dev Server)
```
Browser → http://localhost:5173 (Vite)
           ↓ (proxy rule in vite.config.ts)
           ↓ Intercepts /api/* and rewrites to /materials, /suppliers
           → http://localhost:5000 (Express backend)
```

**Vite proxy configuration:**
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    rewrite: (path) => path.replace(/^\/api/, ''),
  }
}
```

This means:
- Client requests: `/api/materials` → 
- Vite proxy removes `/api` → 
- Backend receives: `/materials` 
- Server route handles: `app.use('/api/materials', ...)`

#### Production (Backend Service)
```
Browser → https://yourdomain.com (CDN)
           ↓ requests to /api/*
           → Reverse proxy or routing layer
           → Backend server handles /api routes
```

### Benefits of /api Prefix
✅ **Security**: Clear separation - prevents accidental direct API access
✅ **Organization**: All API logic under namespace
✅ **Flexibility**: Easy to route differently in different environments
✅ **Versioning**: Can easily support `/api/v2/` in future
✅ **Middleware**: Apply auth/logging to all `/api` routes centrally

### No Code Changes Needed
All API endpoints automatically use `/api/` prefix because:
1. Client API files hardcode `/api/materials`, `/api/suppliers`, etc.
2. Server routes all prefixed with `app.use('/api/...', ...)`
3. They're automatically synchronized in both dev and production!

---

## Database Persistence Strategy

### Current: MySQL (Your Configuration)
Database connection is configured via environment variables:
```env
DATABASE_HOST=your-mysql-host
DATABASE_PORT=3306
DATABASE_NAME=kayan
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
```
```
Use TypeORM with conditional setup:
  Development → SQLite (local file)
  Production → PostgreSQL (cloud)
```

#### Option C: Hybrid with File Storage Service
```
Use AWS S3, Cloudinary, or similar for database backups
Still requires cloud database for production
```

---

## Environment Variables Reference

### Server (.env)

```env
# Core Settings
PORT=5000
NODE_ENV=development  # development or production

# MySQL Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=kayan
DATABASE_USERNAME=root
DATABASE_PASSWORD=yourpassword

# CORS Configuration
FRONTEND_URL=http://localhost:5173  # or production domain

# API Routing
# All backend routes are under /api prefix
# /api/materials, /api/suppliers, /api/transactions, /api/supplier-materials
```

### Client (.env)

```env
# API endpoints use /api prefix
# No VITE_API_BASE_URL needed - axios uses relative paths
# Development: Vite proxy handles /api routing
# Production: Server/reverse proxy handles /api routing

# Example API calls:
# GET /api/materials
# POST /api/suppliers
# DELETE /api/transactions/:id
```

### Example Production Setup

**Server Environment (Railway/Render/DigitalOcean):**
```env
PORT=5000
NODE_ENV=production
DATABASE_HOST=mysql.example.com
DATABASE_PORT=3306
DATABASE_NAME=kayan_prod
DATABASE_USERNAME=kayan_user
DATABASE_PASSWORD=secure_password_here
FRONTEND_URL=https://yourdomain.com
```

---

## Build & Run Commands

### Development
```bash
# Terminal 1: Start backend (port 5000)
cd server
npm run dev

# Terminal 2: Start frontend (port 5173) with Vite proxy
cd client
npm run dev

# Or run both together:
npm run dev  # from root
```

### Production Build
```bash
# Build both applications
npm run build:all

# Start server only (client is built as static files)
npm run start
```

---

## Known Issues to Fix Before Deploying

### ✅ Already Configured
1. ✅ **API Prefix**: All endpoints use `/api` prefix for security
2. ✅ **Environment Variables**: Server port, DB connection, CORS configurable
3. ✅ **Vite Proxy**: Development proxy handles `/api` requests
4. ✅ **axios**: No hardcoded baseURL

### 🔴 Still Need Before Production
1. **Database Connection**: Update MySQL credentials in `.env`
2. **CORS Domain**: Set `FRONTEND_URL` to your production domain
3. **Node Environment**: Ensure `NODE_ENV=production` for production builds

### 🟡 Recommended Before Deploy
1. Set up cloud MySQL database (if not using local)
2. Configure automated backups for database
3. Set up error tracking (Sentry) for production
4. Enable request logging for debugging

---

## Netlify Deployment Steps

### Step 1: Prepare Repository
```bash
git add .
git commit -m "refactor: configure environment variables and deployment settings

- Add .env configuration for development and production
- Set up Vite proxy for API development
- Create netlify.toml with build and routing rules
- Make port, database path, and CORS configurable
- Prepare for flexible scaling between services"

git push
```

### Step 2: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your Git repository
3. Set build command: `npm run install:all && npm run build:all`
4. Set publish directory: `client/dist`
5. Add environment variables in Netlify UI

### Step 3: Set Environment Variables in Netlify UI
```
FRONTEND_URL = https://your-site.netlify.app
NODE_ENV = production
VITE_API_BASE_URL = /api  (or your backend URL)
```

### Step 4: Deploy!
The deployment will:
1. Install dependencies (both client & server)
2. Build client (creates `client/dist`)
3. Start server as Netlify Function
4. Route requests appropriately

---

## Testing Before Going Live

### Local Testing (Production Build)
```bash
npm run build:all
npm run serve:all  # If implemented
```

### Staging on Netlify
1. Keep a separate git branch for staging
2. Deploy from staging branch to test environment
3. Verify API connectivity
4. Check CORS headers
5. Test all CRUD operations

### Production Checklist
- [ ] All environment variables set correctly
- [ ] Database is backed up and accessible
- [ ] SSL/HTTPS enabled (automatic on Netlify)
- [ ] CORS origins configured correctly
- [ ] Logging is enabled for debugging
- [ ] Error handling working properly
- [ ] Performance acceptable

---

## Troubleshooting

### "API returns 404"
→ Check that routes are prefixed with `/api` on backend
→ Verify client API files use `/api` prefix

### "CORS errors in production"
→ Verify `FRONTEND_URL` environment variable matches your domain exactly
→ Check that backend CORS middleware is properly configured

### "Development API calls fail"
→ Check Vite proxy is rewriting `/api` correctly
→ Verify backend is running on correct port
→ Check browser console for actual request URLs

### "Database connection fails"
→ Verify MySQL credentials in `.env`
→ Check database host/port are accessible
→ Ensure database and user exist on MySQL server

### "Build fails"
→ Run `npm run build:client` and `npm run build:server` separately to isolate error
→ Check `npm run build:all` logs for specific failures

---

## Next Steps for Production

1. ✅ Set up cloud database (PostgreSQL recommended)
2. ✅ Migrate from SQLite to cloud DB
3. ✅ Set up CI/CD for automated testing
4. ✅ Add monitoring/logging
5. ✅ Set up error tracking (Sentry, LogRocket)
6. ✅ Implement automated backups
7. ✅ Plan for scaling strategy
