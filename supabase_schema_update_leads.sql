
-- Bio Leads / Contact Messages Table
create table if not exists bio_leads (
  id uuid default uuid_generate_v4() primary key,
  bio_page_id uuid references bio_pages(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null, -- Owner of the page
  name text,
  email text not null,
  message text,
  status text check (status in ('unread', 'read', 'archived')) default 'unread',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
