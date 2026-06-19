-- 1. Kreiranje tabele za meni (menu_items)
drop table if exists menu_items cascade;
create table menu_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  name_en text,
  description text,
  description_en text,
  price numeric not null,
  image_url text,
  category text not null,
  badge text check (badge in ('popular', 'recommended', 'new')),
  orders_count integer default 0,
  sort_order integer default 0,
  is_available boolean default true
);

-- Omogućavanje Realtime-a za menu_items
alter publication supabase_realtime add table menu_items;

-- 2. Kreiranje tabele za informacije o kafiću (cafe_info)
create table if not exists cafe_info (
  id integer primary key default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null default 'Amber & Oak',
  tagline text default 'Dobrodošli',
  logo_url text,
  emoji text default '☕',
  logo_bg text default '#f97316',
  waiter_passcode text default '1357',
  admin_password text default 'admin123',
  superadmin_password text default 'superadmin999'
);

-- Umetanje početnih podataka za kafić ako već ne postoje
insert into cafe_info (id, name, tagline, logo_url, emoji, logo_bg, waiter_passcode, admin_password)
values (1, 'Amber & Oak', 'Dobrodošli', null, '☕', '#f97316', '1357', 'admin123')
on conflict (id) do nothing;

-- Omogućavanje Realtime-a za cafe_info
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'cafe_info'
  ) then
    alter publication supabase_realtime add table cafe_info;
  end if;
end
$$;

-- 3. Kreiranje tabele za narudžbine (orders) ako već ne postoji
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  table_number text not null,
  time_string text not null,
  status text not null default 'pending',
  items jsonb not null
);

-- Omogućavanje Realtime-a za orders
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;
end
$$;

-- 4. Kreiranje tabele za pozive konobara (alerts) ako već ne postoji
create table if not exists alerts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null, -- 'waiter' ili 'bill'
  table_number text not null,
  pay_method text, -- 'cash', 'card' ili null
  time_string text not null
);

-- Omogućavanje Realtime-a za alerts
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'alerts'
  ) then
    alter publication supabase_realtime add table alerts;
  end if;
end
$$;

-- 5. Polise za skladištenje slika (Storage policies) za bucket 'menu-images'
-- Napomena: Prije pokretanja ovih polisa, kreirajte javni bucket pod nazivom 'menu-images' u Supabase Storage-u.
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using (bucket_id = 'menu-images');

drop policy if exists "Allow Uploads" on storage.objects;
create policy "Allow Uploads" on storage.objects for insert with check (bucket_id = 'menu-images');

drop policy if exists "Allow Deletes" on storage.objects;
create policy "Allow Deletes" on storage.objects for delete using (bucket_id = 'menu-images');

drop policy if exists "Allow Updates" on storage.objects;
create policy "Allow Updates" on storage.objects for update using (bucket_id = 'menu-images');

-- 6. Isključivanje RLS (Row Level Security) kako bi klijentska aplikacija mogla čitati/pisati bez autorizacije
alter table cafe_info disable row level security;
alter table menu_items disable row level security;
alter table orders disable row level security;
alter table alerts disable row level security;
