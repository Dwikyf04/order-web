update public.product_variants
set active = false
where product_id = (select id from public.products where legacy_id = 3)
  and legacy_key = 'Kursi Bandara';
