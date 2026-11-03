# Kashif Constructions — Smart Business Management System

A responsive construction-business management dashboard built for Devixo Solutions Task 04.

## Stack
- React + Vite
- Node.js serverless API routes (Vercel Functions)
- MongoDB Atlas
- JWT authentication + bcrypt password hashing
- Recharts + Lucide icons

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`.
4. Run `npm run dev` for the frontend.
5. For local serverless API testing, use Vercel CLI: `npx vercel dev`.

## Deploy from one GitHub repository
1. Push this complete folder to one GitHub repository.
2. Import that repository into Vercel.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy. The `api/` folder is deployed as serverless functions and the React app is served from `dist/`.
5. The included GitHub Actions workflow runs install + production build on every push to `main`. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub repository secrets if you also want the workflow to trigger Vercel deployment.

**Important:** GitHub Pages only hosts static files and cannot run Node.js or connect securely to MongoDB. This project keeps frontend and backend in the same repository; Vercel runs the API functions. Do not put database credentials in frontend code.

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/projects`
- `PATCH|DELETE /api/projects/:id`
- `GET|POST /api/clients`
- `GET|POST /api/tasks`

## Demo mode
The UI includes a local demo mode so the interface can be explored before environment variables are configured. Demo data is stored in the browser only. Real accounts and persistent records require the configured API and MongoDB Atlas.

## Security notes
Passwords are hashed with bcrypt; protected endpoints require a signed JWT; request bodies are validated; secrets are read only from environment variables. Before production use, configure a strong unique JWT secret, MongoDB network access, backups, rate limiting, and HTTPS.
