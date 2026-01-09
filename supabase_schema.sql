-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  username text not null,
  email text not null unique,
  password_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image text,
  role text check (role in ('admin', 'user')) default 'user',
  status text check (status in ('active', 'banned')) default 'active',
  plan text check (plan in ('freemium', 'premium')) default 'freemium',
  reset_token text,
  reset_token_expiry timestamp with time zone
);

-- Urls Table
create table if not exists urls (
  id uuid default uuid_generate_v4() primary key,
  short_code text not null unique,
  original_url text not null,
  user_id uuid references users(id) on delete set null,
  clicks integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('active', 'removed')) default 'active',
  expires_at timestamp with time zone,
  tags text[],
  password text,
  cloaked boolean default false
);

-- Analytics Table
create table if not exists analytics (
  id uuid default uuid_generate_v4() primary key,
  url_id uuid references urls(id) on delete cascade not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  ip text,
  country text,
  city text,
  device text,
  user_id uuid references users(id) on delete cascade not null
);

-- Login History Table
create table if not exists login_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  ip text,
  user_agent text
);

-- Index for login history
create index if not exists idx_login_history_user_id on login_history(user_id);

-- Bio Pages Table
create table if not exists bio_pages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null unique,
  slug text not null unique,
  title text,
  description text,
  avatar_url text,
  theme jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bio Links Table
create table if not exists bio_links (
  id uuid default uuid_generate_v4() primary key,
  bio_page_id uuid references bio_pages(id) on delete cascade not null,
  title text not null,
  url text not null,
  type text default 'link',
  icon text,
  position integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Custom Domains Table
create table if not exists custom_domains (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  domain text not null unique,
  status text check (status in ('pending', 'active', 'error')) default 'pending',
  verified boolean default false,
  dns_record text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teams Table
create table if not exists teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Team Members Table
create table if not exists team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  role text check (role in ('owner', 'admin', 'member', 'viewer')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

-- Add team_id to existing resources
alter table urls add column if not exists team_id uuid references teams(id) on delete set null;
alter table custom_domains add column if not exists team_id uuid references teams(id) on delete set null;
alter table bio_pages add column if not exists team_id uuid references teams(id) on delete set null;