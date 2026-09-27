-- Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.atom_website_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  service text not null,
  message text,
  locale text,
  page_url text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','quoted','won','lost','spam'))
);

alter table public.atom_website_leads enable row level security;

-- Intentionally no public RLS policies. The website writes only through the
-- server-side Vercel Function using SUPABASE_SERVICE_ROLE_KEY.
create index if not exists atom_website_leads_created_at_idx on public.atom_website_leads(created_at desc);
create index if not exists atom_website_leads_status_idx on public.atom_website_leads(status);
