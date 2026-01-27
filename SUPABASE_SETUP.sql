-- Create table if it doesn't exist
create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  text text not null,
  href text not null,
  icon text,
  "order" integer default 0
);

-- Enable RLS
alter table links enable row level security;

-- Policies (Drop and recreate to avoid "already exists" errors)

-- 1. READ: Public (Anon) can read
drop policy if exists "Public links are viewable by everyone" on links;
create policy "Public links are viewable by everyone"
  on links for select
  to anon
  using (true);

-- 2. WRITE: Public (Anon) can write (Since we are using hardcoded client-side auth)
-- WARNING: This effectively makes the table public writable for anyone who knows the API
drop policy if exists "Authenticated users can manage links" on links;
drop policy if exists "Public can manage links" on links;

create policy "Public can manage links"
  on links for all
  to anon
  using (true);

-- SEED DATA
-- WARNING: This will clear all existing links and reset them to the default set
DELETE FROM links;

insert into links (text, href, icon, "order") values
    ('Products & Pricelist', '#', '📋', 1),
    ('Place an Order', '#', '🛒', 2),
    ('Proofs & Testimonials', '#', '✨', 3),
    ('Guidelines & Safety Information', '#', '🛡️', 4),
    ('Contact Us — Slimmetry Manila', '#', '💬', 5),
    ('Slimmetry Davao', '#', '📍', 6),
    ('Slimmetry Bacolod', '#', '📍', 7),
    ('Join Our Telegram Community', '#', '✈️', 8);
