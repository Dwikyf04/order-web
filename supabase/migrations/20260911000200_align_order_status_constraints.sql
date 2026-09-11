-- Align an already-deployed orders table with the application status values.
-- Safe to run repeatedly and does not remove order data.

alter table public.orders
  drop constraint if exists orders_payment_status_check,
  drop constraint if exists orders_delivery_status_check;

alter table public.orders
  add constraint orders_payment_status_check
    check (payment_status in ('Belum', 'Lunas')),
  add constraint orders_delivery_status_check
    check (delivery_status in ('Belum Terkirim', 'Terkirim'));
