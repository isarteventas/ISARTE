-- =====================================================================
--  ISARTE CREACIONES - Configuración de la base de datos
--  Pégalo completo en Supabase > SQL Editor > New query > Run
--  Se puede ejecutar más de una vez sin problema.
-- =====================================================================

-- 1) Tabla de artículos
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('creaciones', 'ropa')),
  category    text not null,
  name        text not null,
  note        text,
  price       numeric(10,2) not null check (price >= 0),
  old_price   numeric(10,2),            -- si tiene valor, el artículo está en promoción
  sizes       text[] not null default '{}',
  images      text[] not null default '{}',
  sold_out    boolean not null default false,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists products_section_created_idx
  on public.products (section, created_at desc);

-- 2) Seguridad (RLS): todos VEN lo visible; solo la administradora (con sesión) modifica
alter table public.products enable row level security;

drop policy if exists "Cualquiera ve artículos visibles" on public.products;
create policy "Cualquiera ve artículos visibles"
  on public.products for select
  using (visible = true);

drop policy if exists "Admin ve todo" on public.products;
create policy "Admin ve todo"
  on public.products for select to authenticated
  using (true);

drop policy if exists "Admin agrega" on public.products;
create policy "Admin agrega"
  on public.products for insert to authenticated
  with check (true);

drop policy if exists "Admin edita" on public.products;
create policy "Admin edita"
  on public.products for update to authenticated
  using (true) with check (true);

drop policy if exists "Admin elimina" on public.products;
create policy "Admin elimina"
  on public.products for delete to authenticated
  using (true);

-- 3) Carpeta pública de fotos (máx. 2 MB por foto, solo imágenes)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Fotos publicas" on storage.objects;
create policy "Fotos publicas"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admin sube fotos" on storage.objects;
create policy "Admin sube fotos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Admin edita fotos" on storage.objects;
create policy "Admin edita fotos"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admin borra fotos" on storage.objects;
create policy "Admin borra fotos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');
