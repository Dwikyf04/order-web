-- Rename the catalog item and retire old package variants without deleting
-- rows that may already be referenced by historical order items.
update public.products
set name = 'kursi bandara',
    updated_at = now()
where legacy_id = 3;

update public.product_variants
set active = false
where product_id = (select id from public.products where legacy_id = 3)
  and legacy_key in ('paket 1', 'paket 2', 'Paket AC-302 4 Seat');
