-- ====================================================================
-- KannadaConnect - Supabase Database Schema & Row Level Security (RLS)
-- ====================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the user_learning_profiles table
create table if not exists public.user_learning_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  saved_phrase_ids jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_learning_profiles enable row level security;

-- 3. Create RLS Policies so authenticated users can only access their own data
drop policy if exists "Users can view own learning profile" on public.user_learning_profiles;
create policy "Users can view own learning profile"
  on public.user_learning_profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own learning profile" on public.user_learning_profiles;
create policy "Users can insert own learning profile"
  on public.user_learning_profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own learning profile" on public.user_learning_profiles;
create policy "Users can update own learning profile"
  on public.user_learning_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Automatic updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_learning_profile_updated on public.user_learning_profiles;
create trigger on_learning_profile_updated
  before update on public.user_learning_profiles
  for each row
  execute function public.handle_updated_at();
