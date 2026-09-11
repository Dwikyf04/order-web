import { supabase } from "../../lib/supabaseClient";

export async function createOrder(orderInput) {
  const { data, error } = await supabase.rpc("create_order", {
    p_school_name: orderInput.school.name,
    p_school_address: orderInput.school.address,
    p_city: orderInput.school.city,
    p_district: orderInput.school.district,
    p_phone: orderInput.school.phone,
    p_budget: orderInput.school.budget,
    p_customer_name: orderInput.customerName || null,
    p_items: orderInput.items,
  });

  if (error) throw error;
  return data;
}

export async function listOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase.rpc("update_order_status", {
    p_order_id: orderId,
    p_payment_status: status.payment_status || null,
    p_delivery_status: status.delivery_status || null,
  });

  if (error) throw error;
  return data;
}
