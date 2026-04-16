# Kayan Materials - MVP ✨

A modern materials management system for suppliers, materials, and transaction tracking. Built with React + TypeScript on the frontend and Express + TypeORM on the backend.

## 🚀 Features

- **Materials Management** - Create, update, and track materials
- **Supplier Management** - Manage suppliers and their offerings  
- **Material-Supplier Relationships** - Track which suppliers offer which materials with pricing
- **Transaction Tracking** - Record and analyze material transactions
- **RTL Support** - Full Arabic language interface support
- **Responsive UI** - Built with MUI and Tailwind CSS

## 📋 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (bundler)
- Material-UI (components)
- Tailwind CSS (styling)
- Axios (HTTP client)
- React Router (navigation)

### Backend
- Express.js (server)
- TypeORM (database ORM)
- SQLite3 (database)
- TypeScript

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client and server dependencies
npm run install:all
```

### 2. Configure Environment Variables

Copy environment templates to local files:

```bash
# Root level
cp .env.example .env

# Client
cp client/.env.example client/.env

# Server  
cp server/.env.example server/.env
```

Edit the `.env` files with your local configuration:

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database/db.sqlite
FRONTEND_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Development Servers

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔨 Build & Production

### Build Both Applications
```bash
npm run build:all
```

This creates:
- `client/dist/` - Optimized React build
- `server/dist/` - Compiled Express server

### Production Run
```bash
npm run start
# Starts Express server on port 5000
```

## 📁 Project Structure

```
kayan-materials/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Helper functions
│   │   ├── api/              # API calls
│   │   └── App.tsx           # Main component
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # Route definitions
│   │   ├── entity/           # TypeORM entities
│   │   ├── dto/              # Data transfer objects
│   │   ├── middleware/       # Express middleware
│   │   └── main.ts           # Server entry point
│   └── package.json
│
├── database/                 # SQLite database files
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
├── ARCHITECTURE.md           # Code architecture docs
└── package.json              # Root package

```

## 🔄 API Endpoints

### Materials `/materials`
- `GET /` - List materials (paginated)
- `POST /` - Create material
- `GET /:id` - Get material details
- `PUT /:id` - Update material
- `DELETE /:id` - Delete material
- `GET /:id/suppliers` - Get suppliers for this material
- `GET /:id/transactions` - Get material transactions

### Suppliers `/suppliers`
- `GET /` - List suppliers
- `POST /` - Create supplier
- `GET /:id` - Get supplier details
- `PUT /:id` - Update supplier
- `DELETE /:id` - Delete supplier
- `GET /:id/materials` - Get materials from supplier
- `GET /:id/transactions` - Get supplier transactions

### Transactions `/transactions`
- `GET /` - List transactions
- `POST /` - Create transaction
- `GET /:id` - Get transaction details
- `PUT /:id` - Update transaction
- `DELETE /:id` - Delete transaction
- `GET /detailed` - Get detailed cost breakdown
- `GET /calculate` - Get material-supplier totals

### Supplier-Materials `/supplier-materials`
- `POST /:supplierId/:materialId` - Link supplier to material
- `DELETE /:supplierId/:materialId` - Remove supplier-material link

## 🌐 Deployment

This project is configured for deployment on **Netlify**. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

### Quick Deployment Checklist
- [ ] Configure environment variables in CI/CD
- [ ] Set database to cloud provider (PostgreSQL recommended)
- [ ] Update CORS origins for production domain
- [ ] Set `NODE_ENV=production`
- [ ] Connect Git repository to Netlify
- [ ] Deploy!

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Full deployment guide for Netlify and other platforms
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Code architecture and design patterns
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Working with the codebase

## 🐛 Debugging

### Check Backend Server
```bash
curl http://localhost:5000/materials
```

### Check Frontend Proxy
Browser DevTools → Network tab → Check API calls

### View Database
```bash
sqlite3 database/db.sqlite
# Then: .schema
# And: SELECT * FROM materials;
```

## 📝 Environment Variables

### Backend (server/.env)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `DATABASE_PATH` | ./database/db.sqlite | SQLite file location |
| `FRONTEND_URL` | http://localhost:5173 | CORS origin (production) |

### Frontend (client/.env)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | http://localhost:5000 | API endpoint URL |

## 🚨 Common Issues & Solutions

**Issue: CORS errors**
→ Check `FRONTEND_URL` in `server/.env` matches your frontend URL

**Issue: API calls fail with 404**
→ Verify backend is running on correct port
→ Check proxy configuration in `client/vite.config.ts`

**Issue: Database not found**
→ Check `DATABASE_PATH` is correct
→ Ensure `database/` directory has write permissions

**Issue: Type errors in TypeScript**
→ Run `npm run build` to get detailed errors
→ Check that both `tsconfig.json` files are properly configured

## 📦 Scripts

```bash
# Development
npm run dev              # Run both client and server
npm run dev:client       # Run client only
npm run dev:server       # Run server only

# Building
npm run build            # Build both apps
npm run build:client     # Build client only
npm run build:server     # Build server only
npm run build:all        # Install and build (for CI/CD)

# Other
npm run lint             # Lint both applications
npm run start            # Start production server
```

## 📄 License

ISC

## 👨‍💻 Development Notes

- Use `.env.example` files as templates for new environment variables
- Keep `.env` files in `.gitignore` - never commit secrets
- Database syncs automatically on server start
- Type safety is enforced with TypeScript in both client and server
- Proxy is configured for seamless development API calls

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Ready for deployment!** Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production setup instructions.
