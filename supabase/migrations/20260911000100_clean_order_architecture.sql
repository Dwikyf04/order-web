create extension if not exists pgcrypto;

-- Preserve the original JSON-based order table before creating the normalized model.
-- This makes the migration safe for the current project, which already has an
-- `orders` table with an `items` JSON column.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'items'
  ) and not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'orders_legacy'
  ) then
    alter table public.orders rename to orders_legacy;
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer unique,
  category_id uuid not null references public.categories(id),
  name text not null,
  description text not null default '',
  unit text not null default 'Unit',
  base_price numeric(14,2) not null check (base_price >= 0),
  image_url text,
  is_featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  legacy_key text,
  name text not null,
  price numeric(14,2) not null check (price >= 0),
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  unique (product_id, legacy_key)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  legacy_order_id text unique,
  order_code text not null unique default ('ORD-' || to_char(now(), 'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  school_name text not null,
  school_address text not null,
  city text not null,
  district text not null,
  phone text not null,
  budget text not null,
  customer_name text,
  total_price numeric(14,2) not null default 0 check (total_price >= 0),
  payment_status text not null default 'Belum' check (payment_status in ('Belum', 'Lunas')),
  delivery_status text not null default 'Belum Terkirim' check (delivery_status in ('Belum Terkirim', 'Terkirim')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name_snapshot text not null,
  variant_name_snapshot text,
  unit_price_snapshot numeric(14,2) not null check (unit_price_snapshot >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(14,2) not null check (subtotal >= 0)
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  changed_by uuid references auth.users(id),
  field_name text not null,
  old_value text,
  new_value text not null,
  changed_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  ('public', '{"name":"TaHUtech","email":"","whatsapp":"","logoUrl":"/img/Baru.png"}'::jsonb)
on conflict (key) do nothing;

create table if not exists public.brand_partners (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('sponsor', 'partner')),
  name text not null,
  image_url text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (type, name)
);

insert into public.brand_partners (type, name, image_url, sort_order) values
  ('sponsor', 'Epson', '/img/epson.jpg', 1),
  ('sponsor', 'Asus', '/img/asus.jpg', 2),
  ('sponsor', 'Lenovo', '/img/lenovo.jpg', 3),
  ('sponsor', 'HP', '/img/hp.jpg', 4),
  ('sponsor', 'Maspion', '/img/maspion.jpg', 5),
  ('sponsor', 'Daikin', '/img/daikin.jpg', 6),
  ('sponsor', 'ROG', '/img/rog.jpg', 7),
  ('sponsor', 'TUF', '/img/tuf.jpg', 8),
  ('sponsor', 'Gree', '/img/gree.png', 9),
  ('partner', 'Bagoestoko', '/img/patnership/toko_bagoes.jpeg', 1),
  ('partner', 'Barata', '/img/patnership/barata1.jpeg', 2),
  ('partner', 'CV BBS', '/img/patnership/cvbbs1.jpeg', 3),
  ('partner', 'Mitra Amanah', '/img/patnership/mitraamanah1.jpeg', 4),
  ('partner', 'Shoes', '/img/patnership/shoes.png', 5),
  ('partner', 'TaHU', '/img/patnership/TaHU.png', 6)
on conflict (type, name) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.create_order(
  p_school_name text,
  p_school_address text,
  p_city text,
  p_district text,
  p_phone text,
  p_budget text,
  p_customer_name text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_variant public.product_variants;
  v_product_id uuid;
  v_variant_id uuid;
  v_quantity integer;
  v_price numeric(14,2);
  v_total numeric(14,2) := 0;
begin
  if nullif(trim(p_school_name), '') is null
    or nullif(trim(p_school_address), '') is null
    or nullif(trim(p_city), '') is null
    or nullif(trim(p_district), '') is null
    or nullif(trim(p_phone), '') is null
    or nullif(trim(p_budget), '') is null then
    raise exception 'Data sekolah belum lengkap';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order harus memiliki minimal satu item';
  end if;

  insert into public.orders (school_name, school_address, city, district, phone, budget, customer_name)
  values (p_school_name, p_school_address, p_city, p_district, p_phone, p_budget, p_customer_name)
  returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.products
    where active = true
      and (
        id::text = nullif(v_item->>'productId', '')
        or legacy_id = case
          when (v_item->>'legacyProductId') ~ '^[0-9]+$'
          then (v_item->>'legacyProductId')::integer
          else null
        end
      );
    if not found then raise exception 'Produk tidak ditemukan atau tidak aktif'; end if;

    v_product_id := v_product.id;
  v_variant_id := nullif(v_item->>'variantId', '')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity is null or v_quantity < 1 then
      raise exception 'Jumlah item tidak valid';
    end if;

    v_price := v_product.base_price;
    if v_variant_id is not null then
      select * into v_variant from public.product_variants
      where id = v_variant_id and product_id = v_product_id and active = true;
      if not found then raise exception 'Varian tidak ditemukan atau tidak aktif'; end if;
      v_price := v_variant.price;
    elsif nullif(v_item->>'variantKey', '') is not null then
      select * into v_variant from public.product_variants
      where legacy_key = v_item->>'variantKey' and product_id = v_product_id and active = true;
      if not found then raise exception 'Varian tidak ditemukan atau tidak aktif'; end if;
      v_variant_id := v_variant.id;
      v_price := v_variant.price;
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name_snapshot,
      variant_name_snapshot, unit_price_snapshot, quantity, subtotal
    ) values (
      v_order.id, v_product.id, v_variant_id, v_product.name,
      case when v_variant_id is null then null else v_variant.name end,
      v_price, v_quantity, v_price * v_quantity
    );

    v_total := v_total + (v_price * v_quantity);
  end loop;

  update public.orders set total_price = v_total, updated_at = now() where id = v_order.id;
  return jsonb_build_object('id', v_order.id, 'order_code', v_order.order_code, 'total_price', v_total);
end;
$$;

create or replace function public.audit_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.payment_status is distinct from new.payment_status then
    insert into public.order_status_history (order_id, changed_by, field_name, old_value, new_value)
    values (new.id, auth.uid(), 'payment_status', old.payment_status, new.payment_status);
  end if;
  if old.delivery_status is distinct from new.delivery_status then
    insert into public.order_status_history (order_id, changed_by, field_name, old_value, new_value)
    values (new.id, auth.uid(), 'delivery_status', old.delivery_status, new.delivery_status);
  end if;
  return new;
end;
$$;

drop trigger if exists order_status_audit on public.orders;
create trigger order_status_audit
after update of payment_status, delivery_status on public.orders
for each row execute function public.audit_order_status_change();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

create or replace function public.update_order_status(
  p_order_id uuid,
  p_payment_status text default null,
  p_delivery_status text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  if not public.is_admin() then
    raise exception 'Akses admin diperlukan';
  end if;

  if p_payment_status is not null and p_payment_status not in ('Belum', 'Lunas') then
    raise exception 'Status pembayaran tidak valid';
  end if;
  if p_delivery_status is not null and p_delivery_status not in ('Belum Terkirim', 'Terkirim') then
    raise exception 'Status pengiriman tidak valid';
  end if;

  update public.orders
  set payment_status = coalesce(p_payment_status, payment_status),
      delivery_status = coalesce(p_delivery_status, delivery_status),
      updated_at = now()
  where id = p_order_id
  returning * into v_order;

  if not found then raise exception 'Order tidak ditemukan'; end if;
  return v_order;
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.site_settings enable row level security;
alter table public.brand_partners enable row level security;

create policy "public can read active catalog" on public.categories for select using (active = true);
create policy "users can read own profile" on public.profiles for select using (id = auth.uid());
create policy "public can read active products" on public.products for select using (active = true);
create policy "public can read active variants" on public.product_variants for select using (active = true);
create policy "admins can read orders" on public.orders for select using (public.is_admin());
create policy "admins can update orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "admins can read order items" on public.order_items for select using (public.is_admin());
create policy "admins can read status history" on public.order_status_history for select using (public.is_admin());
create policy "admins can manage catalog" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins can manage variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "admins can manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "public can read public settings" on public.site_settings for select using (key = 'public');
create policy "admins can manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "public can read active partners" on public.brand_partners for select using (active = true);
create policy "admins can manage partners" on public.brand_partners for all using (public.is_admin()) with check (public.is_admin());
grant execute on function public.create_order(text, text, text, text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.update_order_status(uuid, text, text) to authenticated;
