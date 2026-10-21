-- ============================================================================
-- DSP Portfolio — initial schema, RLS policies, and storage buckets
-- Run this once in the Supabase SQL Editor (or via `supabase db push`).
-- Safe to re-run: every statement is IF NOT EXISTS / OR REPLACE / idempotent
-- where practical, but it is written to run top-to-bottom on a fresh project.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. ADMIN REGISTRY
-- Only user_ids listed here can write anything. Public sign-up never grants
-- this — rows are added manually by you (see README "First Admin Setup").
-- ----------------------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- Nobody reads or writes this table through the public API — it's only
-- ever touched by the is_admin() function below (which runs as the table
-- owner) and by you directly in the SQL editor. No policies = no access
-- via PostgREST, which is exactly what we want.

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admins where user_id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. PROFILE (singleton — one row)
-- ----------------------------------------------------------------------------
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  headline text not null default '',
  intro text not null default '',
  about text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  github text not null default '',
  linkedin text not null default '',
  "resumeUrl" text not null default '/resume.pdf',
  "seekingOpportunities" boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table profile enable row level security;

drop policy if exists "profile_public_read" on profile;
create policy "profile_public_read" on profile for select using (true);

drop policy if exists "profile_admin_write" on profile;
create policy "profile_admin_write" on profile for update using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- 2a. SITE SECTION VISIBILITY (singleton)
-- ----------------------------------------------------------------------------
create table if not exists site_settings (
  id boolean primary key default true check (id),
  sections jsonb not null default '{
    "home": true,
    "about": true,
    "education": true,
    "experience": true,
    "skills": true,
    "projects": true,
    "achievements": true,
    "certifications": true,
    "resume": true,
    "contact": true
  }'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

drop policy if exists "site_settings_public_read" on site_settings;
create policy "site_settings_public_read" on site_settings for select using (true);

drop policy if exists "site_settings_admin_update" on site_settings;
create policy "site_settings_admin_update" on site_settings for update using (is_admin()) with check (is_admin());

insert into site_settings (id) values (true) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 3. Reusable pattern for content tables: published + order + admin-only writes
-- ----------------------------------------------------------------------------

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text not null default '',
  start_date date,
  end_date date,
  end_label text not null default '',
  details text not null default '',
  "order" int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null default 'Code2',
  skills text[] not null default '{}',
  "order" int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  thumbnail_url text not null default '',
  github_url text not null default '',
  live_url text not null default '',
  status text not null default 'In Progress' check (status in ('In Progress', 'Completed')),
  featured boolean not null default false,
  "order" int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null default '',
  type text not null default 'Learning',
  start_date date,
  end_date date,
  description text not null default '',
  "order" int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  date date,
  description text not null default '',
  "order" int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  issue_date date,
  credential_url text not null default '',
  image_url text not null default '',
  "order" int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Apply RLS + policies to every content table in one loop.
do $$
declare
  t text;
begin
  foreach t in array array['education','skill_categories','projects','experience','achievements','certifications']
  loop
    execute format('alter table %I enable row level security;', t);

    execute format('drop policy if exists "%s_public_read" on %I;', t, t);
    execute format(
      'create policy "%s_public_read" on %I for select using (published = true or is_admin());',
      t, t
    );

    execute format('drop policy if exists "%s_admin_insert" on %I;', t, t);
    execute format('create policy "%s_admin_insert" on %I for insert with check (is_admin());', t, t);

    execute format('drop policy if exists "%s_admin_update" on %I;', t, t);
    execute format('create policy "%s_admin_update" on %I for update using (is_admin()) with check (is_admin());', t, t);

    execute format('drop policy if exists "%s_admin_delete" on %I;', t, t);
    execute format('create policy "%s_admin_delete" on %I for delete using (is_admin());', t, t);
  end loop;
end $$;

-- contact_messages: anyone can submit, only the admin can read/delete.
alter table contact_messages enable row level security;

drop policy if exists "messages_public_insert" on contact_messages;
create policy "messages_public_insert" on contact_messages for insert with check (true);

drop policy if exists "messages_admin_read" on contact_messages;
create policy "messages_admin_read" on contact_messages for select using (is_admin());

drop policy if exists "messages_admin_delete" on contact_messages;
create policy "messages_admin_delete" on contact_messages for delete using (is_admin());

-- Table privileges allow the API roles to reach the tables; RLS above still
-- restricts which rows each role can read or modify.
grant select on profile, site_settings, education, skill_categories, projects,
  experience, achievements, certifications, contact_messages to anon, authenticated;
grant update on profile, site_settings to authenticated;
grant insert, update, delete on education, skill_categories, projects,
  experience, achievements, certifications to authenticated;
grant insert on contact_messages to anon, authenticated;
grant delete on contact_messages to authenticated;

-- ----------------------------------------------------------------------------
-- 4. Seed the profile singleton (only if the table is empty)
-- ----------------------------------------------------------------------------
insert into profile (name, headline, intro, about, email, phone, location, github, linkedin, "resumeUrl", "seekingOpportunities")
select
  'Devi Sri Prasad Uddanti',
  'Aspiring Software Developer | AI/ML Enthusiast | Full-Stack Development',
  'I''m a final-year Information Technology student building dynamic, responsive web applications and exploring AI/ML and computer vision through hands-on projects.',
  'I''m Devi Sri Prasad, a B.Tech Information Technology student with a strong foundation in Java, Python, and SQL, and hands-on experience building full-stack and computer-vision projects.',
  'devisriprasadud311@gmail.com',
  '',
  'Vijayawada, Andhra Pradesh, India',
  'https://github.com/Devisriprasad75',
  'https://www.linkedin.com/in/devi-sri-prasad-uddanti-b5a928345',
  '/resume.pdf',
  true
where not exists (select 1 from profile);

-- The phone field is intentionally no longer used by the portfolio. Clear
-- any value from older profile rows so it is not exposed by the public API.
update profile set phone = '' where phone <> '';

-- Seed starter portfolio content only when its corresponding entry is absent.
-- This restores resume-backed content without overwriting existing edits.
insert into education (degree, institution, location, end_date, end_label, details, "order", published)
select 'B.Tech in Information Technology', 'Dhanekula Institute of Engineering & Technology',
  'Vijayawada, India', '2027-06-01', 'Expected June 2027', '', 1, true
where not exists (select 1 from education where degree = 'B.Tech in Information Technology');

insert into education (degree, institution, location, end_date, end_label, details, "order", published)
select 'Intermediate', 'Andhra Loyola College', 'Vijayawada, India', '2023-06-01', 'June 2023', '', 2, true
where not exists (select 1 from education where degree = 'Intermediate');

insert into education (degree, institution, location, end_date, end_label, details, "order", published)
select 'High School', 'Zilla Parishad High School', 'Penamaluru, Vijayawada, India',
  '2021-04-01', 'April 2021', '', 3, true
where not exists (select 1 from education where degree = 'High School');

insert into skill_categories (name, icon, skills, "order", published)
select 'Programming', 'Code2', array['Java', 'Python', 'SQL'], 1, true
where not exists (select 1 from skill_categories where name = 'Programming');

insert into skill_categories (name, icon, skills, "order", published)
select 'Frontend Development', 'LayoutTemplate', array['HTML', 'CSS', 'JavaScript', 'React'], 2, true
where not exists (select 1 from skill_categories where name = 'Frontend Development');

insert into skill_categories (name, icon, skills, "order", published)
select 'Backend & APIs', 'Server', array['REST APIs'], 3, true
where not exists (select 1 from skill_categories where name = 'Backend & APIs');

insert into skill_categories (name, icon, skills, "order", published)
select 'Databases', 'Database', array['MySQL'], 4, true
where not exists (select 1 from skill_categories where name = 'Databases');

insert into skill_categories (name, icon, skills, "order", published)
select 'AI & Computer Vision', 'ScanEye', array['OpenCV'], 5, true
where not exists (select 1 from skill_categories where name = 'AI & Computer Vision');

insert into skill_categories (name, icon, skills, "order", published)
select 'Development Tools', 'GitBranch', array['Git', 'GitHub'], 6, true
where not exists (select 1 from skill_categories where name = 'Development Tools');

insert into projects (title, summary, description, technologies, thumbnail_url, github_url, live_url,
  status, featured, "order", published)
select 'Weather Dashboard',
  'A responsive weather app that fetches live conditions for any city via a REST API.',
  'Built a dynamic, responsive weather application using HTML, CSS and JavaScript that consumes a third-party REST API to fetch and render live weather data based on user-entered city input. Handled asynchronous requests with the Fetch API, parsed JSON responses to display temperature, feels-like temperature, humidity, wind speed, pressure, and sunrise/sunset times, and implemented client-side state handling for loading, error, and empty-result conditions so the app stays usable through network failures and invalid input.',
  array['HTML', 'CSS', 'JavaScript', 'REST API'], '', '', '',
  'Completed', true, 1, true
where not exists (select 1 from projects where title = 'Weather Dashboard');

insert into projects (title, summary, description, technologies, thumbnail_url, github_url, live_url,
  status, featured, "order", published)
select 'Driver Safety System',
  'Real-time drowsiness detection using facial-landmark analysis with live visual and audio alerts.',
  'Developed a real-time driver monitoring system using HTML, CSS, JavaScript and Python with OpenCV to detect drowsiness through continuous facial-landmark analysis. Built an event-driven alert mechanism that triggers dynamic on-screen and audio warnings the moment unsafe conditions are detected, updating the interface in real time without page reloads.',
  array['HTML', 'CSS', 'JavaScript', 'Python', 'OpenCV'], '', '', '',
  'Completed', true, 2, true
where not exists (select 1 from projects where title = 'Driver Safety System');

insert into experience (title, organization, type, description, "order", published)
select 'Fresher Trainee Program — Applicant', 'HCLTech', 'Learning / Application Target',
  'Preparing for and applying to full-stack developer trainee programs, building project and interview-ready skills in Java, React, and REST API integration.',
  1, true
where not exists (select 1 from experience where title = 'Fresher Trainee Program — Applicant');

insert into achievements (title, issuer, description, "order", published)
select '3rd Prize — ELEVATEX Hackathon', 'Codegnan, Vijayawada',
  'Built a working solution within a 12-hour time constraint, demonstrating rapid problem-solving, teamwork, and end-to-end development under pressure.',
  1, true
where not exists (select 1 from achievements where title = '3rd Prize — ELEVATEX Hackathon');

insert into achievements (title, issuer, description, "order", published)
select '1st Prize — Prompt to Print Coding Competition', '',
  'Secured first place in a competitive programming contest, demonstrating strong algorithmic problem-solving and programming skills.',
  2, true
where not exists (select 1 from achievements where title = '1st Prize — Prompt to Print Coding Competition');

insert into certifications (title, issuer, issue_date, credential_url, image_url, "order", published)
select 'Google AI-ML Certificate', 'Google', '2026-09-01', '', '', 1, true
where not exists (select 1 from certifications where title = 'Google AI-ML Certificate');

insert into certifications (title, issuer, issue_date, credential_url, image_url, "order", published)
select 'Google Cloud Cybersecurity Certificate', 'Google Cloud', '2025-09-01', '', '', 2, true
where not exists (select 1 from certifications where title = 'Google Cloud Cybersecurity Certificate');

insert into certifications (title, issuer, issue_date, credential_url, image_url, "order", published)
select 'AI For Beginners', '', '2025-06-01', '', '', 3, true
where not exists (select 1 from certifications where title = 'AI For Beginners');

insert into certifications (title, issuer, issue_date, credential_url, image_url, "order", published)
select 'TechA Front End Development Foundation Certificate', '', '2025-03-01', '', '', 4, true
where not exists (select 1 from certifications where title = 'TechA Front End Development Foundation Certificate');

insert into certifications (title, issuer, issue_date, credential_url, image_url, "order", published)
select 'TechA Responsive Web Designing Foundation Certificate', '', '2025-03-01', '', '', 5, true
where not exists (select 1 from certifications where title = 'TechA Responsive Web Designing Foundation Certificate');

-- ----------------------------------------------------------------------------
-- 5. Storage buckets: resumes (resume PDF) and project-images (thumbnails)
-- Public read, admin-only write.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do update
set public = true, file_size_limit = 10485760, allowed_mime_types = array['application/pdf'];

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update
set public = true, file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "resumes_public_read" on storage.objects;
create policy "resumes_public_read" on storage.objects for select using (bucket_id = 'resumes');

drop policy if exists "resumes_admin_write" on storage.objects;
create policy "resumes_admin_write" on storage.objects for insert with check (bucket_id = 'resumes' and is_admin());

drop policy if exists "resumes_admin_update" on storage.objects;
create policy "resumes_admin_update" on storage.objects for update using (bucket_id = 'resumes' and is_admin());

drop policy if exists "resumes_admin_delete" on storage.objects;
create policy "resumes_admin_delete" on storage.objects for delete using (bucket_id = 'resumes' and is_admin());

drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read" on storage.objects for select using (bucket_id = 'project-images');

drop policy if exists "project_images_admin_write" on storage.objects;
create policy "project_images_admin_write" on storage.objects for insert with check (bucket_id = 'project-images' and is_admin());

drop policy if exists "project_images_admin_update" on storage.objects;
create policy "project_images_admin_update" on storage.objects for update using (bucket_id = 'project-images' and is_admin());

drop policy if exists "project_images_admin_delete" on storage.objects;
create policy "project_images_admin_delete" on storage.objects for delete using (bucket_id = 'project-images' and is_admin());

-- ============================================================================
-- Done. Next: create your login in Authentication > Users (disable public
-- sign-ups first), then run the "First Admin Setup" statement from the
-- README to insert your user_id into the admins table.
-- ============================================================================
