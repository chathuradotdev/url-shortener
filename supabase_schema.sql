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
  browser text,
  os text,
  referrer text
);

-- Indexes for performance
create index if not exists idx_urls_short_code on urls(short_code);
create index if not exists idx_urls_user_id on urls(user_id);
create index if not exists idx_analytics_url_id on analytics(url_id);
create index if not exists idx_users_email on users(email);
