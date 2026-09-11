import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY first.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function normalizePaymentStatus(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "lunas"
    ? "Lunas"
    : "Belum";
}

function normalizeDeliveryStatus(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "terkirim"
    ? "Terkirim"
    : "Belum Terkirim";
}

const { data: legacyOrders, error: orderError } = await supabase
  .from("orders_legacy")
  .select("*")
  .order("created_at", { ascending: true });
if (orderError) throw orderError;

for (const legacy of legacyOrders || []) {
  const legacyOrderId = String(legacy.id);
  const { data: existing, error: existingError } = await supabase
    .from("orders")
    .select("id")
    .eq("legacy_order_id", legacyOrderId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) {
    console.log(`Skipped existing legacy order ${legacyOrderId}`);
    continue;
  }

  const items = Array.isArray(legacy.items) ? legacy.items : [];
  const normalizedItems = [];
  for (const item of items) {
    const rawId = String(item.catalogId ?? item.id ?? "");
    const [legacyProductId, variantIndex] = rawId.split("-");
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, unit, base_price")
      .eq("legacy_id", Number(legacyProductId))
      .maybeSingle();
    if (productError) throw productError;
    if (!product) {
      console.warn(`Skipped unknown legacy product ${rawId} in order ${legacyOrderId}`);
      continue;
    }

    let variant = null;
    if (item.variantKey) {
      const { data, error } = await supabase
        .from("product_variants")
        .select("id, name, price")
        .eq("product_id", product.id)
        .eq("legacy_key", item.variantKey)
        .maybeSingle();
      if (error) throw error;
      variant = data;
    } else if (variantIndex !== undefined) {
      const { data, error } = await supabase
        .from("product_variants")
        .select("id, name, price")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      variant = data?.[Number(variantIndex)] || null;
    }

    const quantity = Math.max(1, Number(item.qty || item.quantity || 1));
    const unitPrice = Number(variant?.price ?? item.price ?? product.base_price);
    normalizedItems.push({ product, variant, quantity, unitPrice });
  }

  if (!normalizedItems.length) {
    console.warn(`Skipped legacy order ${legacyOrderId}: no valid items`);
    continue;
  }

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      legacy_order_id: legacyOrderId,
      school_name: legacy.school_name || legacy.customer_school || "-",
      school_address: legacy.school_address || legacy.address || "-",
      city: legacy.city || "-",
      district: legacy.district || legacy.kecamatan || "-",
      phone: legacy.phone || legacy.telepon || "-",
      budget: legacy.budget || legacy.anggaran || "-",
      customer_name: legacy.customer_name || null,
      total_price: Number(legacy.total_price || 0),
      payment_status: normalizePaymentStatus(legacy.payment_status),
      delivery_status: normalizeDeliveryStatus(legacy.delivery_status),
      created_at: legacy.created_at || undefined,
    })
    .select("id")
    .single();
  if (insertError) throw insertError;

  const { error: itemError } = await supabase.from("order_items").insert(
    normalizedItems.map(({ product, variant, quantity, unitPrice }) => ({
      order_id: order.id,
      product_id: product.id,
      variant_id: variant?.id || null,
      product_name_snapshot: product.name,
      variant_name_snapshot: variant?.name || null,
      unit_price_snapshot: unitPrice,
      quantity,
      subtotal: unitPrice * quantity,
    }))
  );
  if (itemError) throw itemError;
  console.log(`Migrated legacy order ${legacyOrderId}`);
}

console.log(`Legacy order migration complete: ${legacyOrders?.length || 0} source rows.`);
