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

## API Communication: Proxying vs Localhost

### Current Setup (Development)
Your project uses **relative API paths** which is perfect:
```typescript
// Good ✅ - uses relative paths
const API_URL = '/materials'
axios.get(`/suppliers`)
```

This allows **automatic proxying** - no CORS needed!

### How It Works

#### Development (Vite Dev Server)
```
Browser → http://localhost:5173 (Vite)
           ↓ (proxy rule in vite.config.ts)
           → http://localhost:5000 (Express)
```

**Setup needed in `vite.config.ts`:**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/materials': 'http://localhost:5000',
      '/suppliers': 'http://localhost:5000',
      '/transactions': 'http://localhost:5000',
      '/supplier-materials': 'http://localhost:5000',
    }
  }
})
```

#### Production (Netlify)
```
Browser → https://yourdomain.netlify.app (CDN)
           ↓ (netlify.toml rewrites)
           → Backend API function/server
```

**NO CORS issues** because requests stay on same domain!

### Flexible Development Without Changing Code

**Development (.env):**
```
VITE_API_BASE_URL=/api  # Relative - uses proxy
```

**Production (.env.production):**
```
VITE_API_BASE_URL=https://api.yourdomain.com  # Can point anywhere
```

The `import.meta.env.VITE_API_BASE_URL` in your client code will use the appropriate value.

---

## Database Persistence Strategy

### Current: SQLite (Development)
```
❌ SQLite doesn't work on Netlify (no persistent filesystem)
   Files are deleted after function execution
```

### For Production: Choose One

#### Option A: Cloud PostgreSQL (Recommended)
```
Providers: Neon, Supabase, Railway, Render
NPM: npm install pg
Benefits: Scalable, backed up, can use existing TypeORM code
```

#### Option B: Keep SQLite Local (Development Only)
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
NODE_ENV=production

# Database
DATABASE_PATH=./database/db.sqlite  # Local dev only
DATABASE_URL=postgresql://...       # Production only

# CORS
FRONTEND_URL=https://kayan-materials.netlify.app
```

### Client (.env.production)

```env
# API Endpoint - can be different from frontend URL
VITE_API_BASE_URL=https://api.yourdomain.com

# Or same domain (if using reverse proxy)
VITE_API_BASE_URL=/api
```

---

## Build & Run Commands

### Development
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend with proxy
cd client
npm run dev
```

### Production Build
```bash
# Root level
npm run build:all
npm run start:server

# Or in Netlify/Railway: uses npm start scripts
```

---

## Known Issues to Fix Before Deploying

### 🔴 Critical
1. **Axios baseURL hardcoded** → Use environment variable
2. **Server port hardcoded** → Use `process.env.PORT`
3. **Database path hardcoded** → Use `process.env.DATABASE_PATH`
4. **Frontend URL in CORS** → Use environment variable

### 🟡 Important
1. No `.env` configuration system
2. No production database configured
3. SQLite won't persist on serverless platforms

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

### "API calls hitting localhost in production"
→ Check `VITE_API_BASE_URL` environment variable

### "CORS errors"
→ Verify `FRONTEND_URL` environment variable matches deployed domain

### "Database not persisting"
→ SQLite doesn't work on Netlify Functions. Use cloud database.

### "Build fails"
→ Check `npm run build:all` logs in Netlify UI

---

## Next Steps for Production

1. ✅ Set up cloud database (PostgreSQL recommended)
2. ✅ Migrate from SQLite to cloud DB
3. ✅ Set up CI/CD for automated testing
4. ✅ Add monitoring/logging
5. ✅ Set up error tracking (Sentry, LogRocket)
6. ✅ Implement automated backups
7. ✅ Plan for scaling strategy
