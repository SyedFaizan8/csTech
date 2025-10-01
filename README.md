# MERN Assignment — Admin Panel

This repository contains a full-stack **MERN** assignment example (backend + frontend) implementing:

- Admin **login** with JWT (httpOnly cookie)
- **Agent** creation, listing & deletion
- **CSV / XLS / XLSX** upload with validation and preview
- **Distribution** of uploaded items equally among 5 agents (remainders distributed sequentially)
- Saving **assignments** and **list items** in **MongoDB** via **Prisma**
- Protected frontend routes and clean error UI (toasts, modals)
- Frontend: **Next.js (App Router) + TypeScript + Tailwind CSS + Redux Toolkit**

---

## Technologies used

### Backend

- Node.js (14+/16+/18+)
- Express.js
- TypeScript
- Prisma ORM (MongoDB)
- MongoDB (local or Atlas)
- bcryptjs
- jsonwebtoken
- multer (file uploads)
- csv-parse / xlsx (file parsing)
- cookie-parser
- cors

### Frontend

- Next.js (App Router) + TypeScript
- React 18
- Tailwind CSS
- Redux Toolkit (state)
- react-hook-form (forms)
- react-dropzone (file drop)
- xlsx (client parsing of Excel files)
- axios (API requests)

---

## Repository structure (recommended)

```
/backend
  /src
    prismaClient.ts
    server.ts
    routes/
      auth.ts
      agents.ts
      upload.ts
      assignments.ts
    middleware/
      requireAuth.ts
    utils/
      jwt.ts
  prisma/
    schema.prisma
  package.json
  .env
/frontend
  /app
    (Next.js App Router pages)
  /components
  /store
  package.json
  .env.local
```

---

## Environment variables

Create `.env` files in both `backend/` and `frontend/` as shown.

### `backend/.env`

```
DATABASE_URL="mongodb://localhost:27017/mern_assign"
JWT_SECRET="replace_with_a_secure_random_string"
PORT=4000
```

- `DATABASE_URL` — MongoDB connection string (local or Atlas). If using local MongoDB, make sure it is reachable.
- `JWT_SECRET` — secret for signing JWT tokens. Use a long random string for production.

### `frontend/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Backend — Setup & Run

1. Install dependencies:

```bash
cd backend
npm install
```

2. Generate Prisma client and push schema to DB:

```bash
npx prisma generate
npx prisma db push
```

> If you are using MongoDB as a standalone server and Prisma complains about transactions or replica sets, you have options:
>
> - Run MongoDB as a replica set (required for multi-document transactions).
> - Use Atlas (managed MongoDB) which supports replica sets by default.
> - Adjust Prisma schema to store embedded data as `Json` to avoid cross-document transactions.

3. Start dev server:

```bash
npm run dev
```

Server will run on `http://localhost:4000` (or `PORT` in `.env`).

### Useful backend endpoints

- `POST /api/auth/signup` — create admin (dev, if `ALLOW_SIGNUP=true`)
- `POST /api/auth/login` — login (returns httpOnly cookie `token`)
- `GET /api/auth/me` — get current user (requires cookie)
- `POST /api/auth/logout` — clear cookie
- `GET /api/agents` — list agents (protected)
- `POST /api/agents` — create agent (protected)
- `DELETE /api/agents/:id` — delete agent & cleanup (protected)
- `POST /api/upload` — upload CSV/XLSX (protected)
- `GET /api/assignments` — list assignments (protected)

---

## Frontend — Setup & Run

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend (default `http://localhost:4000`):

3. Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Quick workflow

1. Start backend (`backend`): `npm run dev`
2. Start frontend (`frontend`): `npm run dev`
3. Signup as admin
4. Login at `/login` in the frontend.
5. Create at least 5 agents (Agents page).
6. Upload a CSV/XLSX file (Upload page). The app will:
   - Validate rows (ensure `FirstName` and `Phone`)
   - Create `ListItem` records
   - Distribute equally among 5 agents
   - Create `Assignment` records linking to `ListItem`s
7. View assignments per agent in the Agents page.

---

## CSV/XLS(X) format

Accepted columns (header names case-insensitive but recommended):

- `FirstName` — text (required)
- `Phone` — phone number (required)
- `Notes` — optional text

Example CSV:

```csv
FirstName,Phone,Notes
Alice,+1234567890,Follow up next week
Bob,+1987654321,Interested in premium plan
```

---

## UI behavior & error handling

- Authentication state is stored server-side in an **httpOnly cookie** named `token`. Frontend calls `/api/auth/me` to get current user.
- Protected pages use a hook `useRequireAuth()` to redirect unauthorized visitors to `/login`.
- Errors are shown as **toasts** (notification system) and inline form errors.
- Upload preview is done client-side; `.xlsx`/`.xls` files are parsed by dynamically importing `xlsx` in the browser.

---

thankyou.
