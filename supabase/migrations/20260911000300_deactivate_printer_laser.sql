-- Hide the removed legacy catalog item without deleting historical references.
update public.products
set active = false,
    updated_at = now()
where legacy_id = 96;
