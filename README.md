# MongoDB Atlas + Next.js User Setup

## Files included
- `app/lib/mongodb.ts` — cached Mongoose connection helper
- `models/User.ts` — User schema (name, email)
- `app/api/users/route.ts` — GET (list users) / POST (create user) API route
- `app/team/page.tsx` — Team page with add-user form + user list
- `components/MainContent.tsx` — shared layout wrapper used by the Team page
- `.env.local.example` — template for your MongoDB connection string

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your real Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority
   ```
2. Install mongoose:
   ```bash
   npm install mongoose
   ```
3. Merge these files into your existing Next.js project (matching folder paths above).
4. In MongoDB Atlas:
   - Database Access → create a DB user
   - Network Access → allow your IP (or `0.0.0.0/0` for dev)
5. Restart your dev server so the new env var loads:
   ```bash
   npm run dev
   ```
6. Visit `/team` to add and view users, or test the API directly:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Jane Doe","email":"jane@example.com"}'
   ```
