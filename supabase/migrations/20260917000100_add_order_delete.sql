-- Allow admins to remove an order and its related history safely.
-- Related order_items and order_status_history rows are removed by CASCADE.

create or replace function public.delete_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses admin diperlukan';
  end if;

  delete from public.orders where id = p_order_id;

  if not found then
    raise exception 'Pesanan tidak ditemukan';
  end if;
end;
$$;

grant execute on function public.delete_order(uuid) to authenticated;
