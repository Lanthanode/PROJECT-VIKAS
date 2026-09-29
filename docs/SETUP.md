# 🛠️ Setup & Installation Guide

This guide provides complete instructions to set up, configure, and execute the **Railway Management System** on any computer from scratch.

---

## 1. System Requirements

- **Operating System**: Windows 10/11, macOS (12+), or Linux (Ubuntu 20.04+)
- **Node.js**: Version `18.17.0` or higher (`v20+` or `v25+` recommended)
- **NPM**: Version `9.0.0` or higher
- **Web Browser**: Chrome, Edge, Safari, or Firefox
- **Optional**: PostgreSQL server (if connecting to external database)

---

## 2. One-Click Setup (Windows)

For Windows machines, a batch script is provided for instant setup:

1. Double-click `START_RAILWAY_SYSTEM.bat`.
2. The script checks for Node.js, installs npm dependencies if missing, boots the integrated PostgreSQL database, and opens `http://localhost:3000` in your default browser.

---

## 3. Manual Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Lanthanode/PROJECT-VIKAS.git
cd PROJECT-VIKAS
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Engine Configuration
The application comes pre-packaged with an embedded PostgreSQL 16 engine (`@electric-sql/pglite`) compiled directly from PostgreSQL C source code to WebAssembly.

- **Zero configuration required**: All tables, constraints, foreign keys, triggers, and seed data automatically initialize in `./data/railway_db` on first run!
- **Optional Remote PostgreSQL**: If you wish to use an external PostgreSQL database (Supabase, Neon, AWS RDS, or local psql), copy `.env.example` to `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
  Edit `.env.local` and specify your `DATABASE_URL`:
  ```env
  DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB_NAME]?sslmode=require
  ```

### Step 4: Run the Application Locally
To launch the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 5: Production Build (Optional)
To test the optimized production build:
```bash
npm run build
npm run start
```

---

## 4. Default Credentials & Ports
- **Application URL**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin`
- **Master Admin Password**: `admin123`

---

## 5. Troubleshooting Common Issues

### Issue 1: Port 3000 is already in use
Run the application on a custom port:
```bash
npx next dev -p 3005
```

### Issue 2: Node.js version error
Verify your Node.js version by running:
```bash
node -v
```
If your version is below 18, download the latest LTS release from [https://nodejs.org/](https://nodejs.org/).
