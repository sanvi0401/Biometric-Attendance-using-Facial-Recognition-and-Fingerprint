-- Create auth schema for students and faculty
create table public.profiles (
  id uuid references auth.users on delete cascade,
  name text,
  role text check (role in ('admin', 'faculty', 'student')),
  department text,
  semester integer,
  roll_number text,
  status text default 'active',
  biometric_data text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create function to handle new user profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, email)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role', new.email);
  return new;
end;
$$;

-- Create trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();