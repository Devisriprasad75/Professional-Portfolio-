# Devi Sri Prasad Uddanti — Portfolio

A React + Vite + Tailwind portfolio with a secure Supabase-backed admin dashboard
at `/admin`, so every section (profile, education, skills, projects, experience,
achievements, certifications, resume, contact messages) can be edited without
touching code.

**Status of this build:** this is real, working code — not a mockup. What it
cannot include is *your* live Supabase project, *your* Netlify deployment, or
your actual LinkedIn URL — those need your own accounts/credentials, which I
don't have. Every step below is exact and copy-pasteable.

Until you connect Supabase, the site runs perfectly well in **read-only mode**
from `src/data/fallbackContent.js` (your resume content), so you can deploy it
today and wire up the admin dashboard whenever you're ready.

---

## 1. Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173. Without `.env.local` filled in, the site renders
from the resume-sourced fallback content and the contact form/admin login will
say Supabase isn't configured yet — that's expected until step 2.

For PowerShell users who are ready to connect Supabase, create the local
environment file with `Copy-Item .env.example .env.local`, then add the public
Supabase URL and anon key described below.

## 2. Create your Supabase project

1. Go to https://supabase.com, create a free account, and create a new project.
2. In **Project Settings → API**, copy the **Project URL** and the **anon
   public** key (never the `service_role` key — that one must never leave the
   Supabase dashboard).
3. Paste them into `.env.local`:

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

## 3. Run the database migration

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/migrations/0001_init.sql` and run it.

This single migration:
- Creates every content table (`profile`, `education`, `skill_categories`,
  `projects`, `experience`, `achievements`, `certifications`, `contact_messages`,
  and `site_settings` for public section visibility).
- Enables **Row Level Security on every table**.
- Creates an `admins` table and an `is_admin()` function — **write access is
  granted only to user IDs listed in `admins`**, not to "anyone logged in."
- Creates public-read, admin-write **Storage buckets**: `resumes` (PDF, up to
  10 MB) and `project-images` (JPG, PNG, WebP, or GIF, up to 5 MB).
- Grants the Supabase API roles the table privileges needed to use the app;
  row-level security still limits which records can be read or changed.
- Seeds the profile and resume-backed portfolio content, only filling content
  entries that are missing so rerunning the migration does not overwrite edits.
- Clears any legacy phone number from the profile because phone contact details
  are no longer used by the portfolio.

You can re-run this file safely. If you already initialized Supabase, rerun the
updated migration in the SQL Editor to apply table grants and populate any
missing starter entries. It will not replace existing content.

## 4. Turn off public sign-ups (important)

In **Authentication → Providers → Email**, and in **Authentication → Settings**,
turn **"Allow new users to sign up" OFF**. This app has no public registration
screen, but disabling it at the Supabase level is defense in depth — it means
even a direct API call can't create new accounts.

## 5. Create your first admin account

1. In **Authentication → Users**, click **Add user → Create new user**. Enter
   your email and a strong password. (Or use "Invite" if you'd rather set the
   password via email link.)
2. Copy the new user's **UID** from the users list.
3. Back in **SQL Editor**, run:

   ```sql
   insert into admins (user_id) values ('paste-the-uid-here');
   ```

That's it — that one row is what makes this account an admin. No one else,
including other authenticated users, can write to any table without a
matching row in `admins`.

4. Go to `/admin/login` on your running site and sign in.

## 6. Add your real content

The dashboard (`/admin`) has tabs for Profile, Education, Skills, Projects,
Experience, Achievements, Certifications, Site Sections, and Messages — with
create/edit/delete controls for content, a "Published" toggle (hide a row from
the public site without deleting it), a "Featured" flag for projects, content
previews, and visibility controls for public sections.

Project thumbnails and certificate images can be uploaded from their editor
using the admin-only `project-images` bucket, or supplied as an image URL.

Your resume PDF ships at `public/resume.pdf` (your uploaded file) and your
photo at `public/assets/profile.png`. To replace the resume later, use the
**Upload new resume** button in the Profile tab — it uploads to the `resumes`
Storage bucket and updates the public resume link site-wide.

**LinkedIn:** the supplied public profile URL is prefilled in the fallback
profile. If Supabase was initialized before adding it, update the Profile tab
in `/admin` or run this SQL once in the Supabase SQL Editor:

```sql
update profile
set linkedin = 'https://www.linkedin.com/in/devi-sri-prasad-uddanti-b5a928345';
```

## 7. Production build & deploy to Netlify

```bash
npm run build        # outputs to dist/
```

**Option A — Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Option B — Netlify dashboard (connects to GitHub):**
1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command: `npm run build` · Publish directory: `dist`
4. In **Site configuration → Environment variables**, add `VITE_SUPABASE_URL`
   and `VITE_SUPABASE_ANON_KEY` (same values as your `.env.local`).
5. Deploy.

`netlify.toml` is already set up with the SPA redirect (`/* → /index.html`)
so client-side routes like `/admin` work on refresh, plus baseline security
headers.

**Replacing your existing site:** if `devisriprasaduddanti.netlify.app` is a
site you already own in Netlify, you can either connect this repo to that
same Netlify site (Site configuration → Build & deploy → Link to a different
repo), or deploy this as a new site and update your DNS/custom domain to
point at it from **Domain management**.

## 8. Final security & functionality checklist

- [ ] Public sign-ups disabled in Supabase Auth settings
- [ ] Only your user_id exists in the `admins` table
- [ ] `.env.local` is in `.gitignore` (it is, by default) and was never committed
- [ ] Only the `anon` key is used in the app — `service_role` key never appears anywhere in `src/`
- [ ] Logged out in an incognito window, confirm `/admin` redirects to `/admin/login`
- [ ] Confirm an unauthenticated request can't write: in browser dev tools, try posting to a table via the Supabase JS client without logging in — it should be rejected by RLS
- [ ] Add/edit/delete one row of each content type from `/admin`, confirm it appears/disappears on the public site
- [ ] Upload a resume PDF and a project thumbnail, confirm both are publicly viewable
- [ ] Submit the contact form as a visitor, confirm it appears under the Messages tab
- [ ] Set your real LinkedIn URL once confirmed
- [ ] Test on mobile widths and in both light and dark theme

## Project structure

```
src/
  components/       Navbar, Footer, shared UI primitives
  sections/         Public page sections (Hero, About, Projects, ...)
  pages/            Home.jsx, admin/ (Login, Dashboard, CrudManager, ...)
  hooks/            useAuth, useTheme
  lib/              supabase client, public content reader, admin query helpers
  data/             Resume-sourced fallback/seed content
supabase/
  migrations/0001_init.sql   Full schema + RLS policies + storage buckets
public/
  resume.pdf, assets/profile.png, favicon.svg
```

## What still needs you

- Your own Supabase project + the SQL migration run (steps 2–5 above)
- Your real LinkedIn URL
- Netlify deployment / domain connection (step 7)
- Anything in resume data marked with a blank or "not yet confirmed" (e.g.
  certificate issuers/credential URLs) — fill these in via `/admin` once set up
