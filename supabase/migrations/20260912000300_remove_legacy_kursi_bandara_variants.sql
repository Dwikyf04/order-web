-- Retire obsolete labels that were seeded before the catalog names were finalized.
update public.product_variants
set active = false
where product_id = (select id from public.products where legacy_id = 3)
  and legacy_key in (
    'Paket Bandara C401 4 Seat',
    'Paket Bandara C301 3 Seat',
    'Paket Bandara W350 3 Seat',
    'Paket Bandara W450 4 Seat'
  );
