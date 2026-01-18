-- Add settings column to bio_links for storing block-specific data (like poll options)
alter table bio_links add column if not exists settings jsonb default '{}'::jsonb;

-- Create table to track poll votes
create table if not exists poll_votes (
    id uuid default uuid_generate_v4() primary key,
    link_id uuid references bio_links(id) on delete cascade not null,
    option_id text not null,
    voter_ip text,
    created_at timestamp with time zone default now(),
    -- Optional: Enforce one vote per IP per poll
    -- We make it composite unique so insert fails if they try again
    unique(link_id, voter_ip) 
);

-- Index for fast counts
create index if not exists idx_poll_votes_link_id on poll_votes(link_id);
