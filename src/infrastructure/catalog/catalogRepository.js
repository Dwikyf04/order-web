import { supabase } from "../../lib/supabaseClient";

const featuredCatalogOrder = [
  95, 93, 90,
  97, 98, 2,
  29, 99, 92,
  91, 100, 35,
  94, 101,
];

function mapProduct(row) {
  return {
    id: row.id,
    nama: row.name,
    spesifikasi: row.description || "",
    satuan: row.unit,
    category: row.categories?.name || "Lainnya",
    categorySlug: row.categories?.slug,
    price: Number(row.base_price),
    img: row.image_url,
    variants: (row.product_variants || [])
      .filter((variant) => variant.active !== false)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((variant) => ({
      id: variant.id,
      key: variant.legacy_key,
      name: variant.name,
      price: Number(variant.price),
      img: variant.image_url,
      })),
  };
}

export async function listCatalog({ category, featuredOnly = false } = {}) {
  let query = supabase
    .from("products")
    .select("*, categories!inner(name, slug), product_variants(*)")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (featuredOnly) query = query.eq("is_featured", true);
  if (category && category !== "Semua" && category !== "Unggulan") {
    query = query.eq("categories.slug", category);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data || [];
  if (featuredOnly) {
    const order = new Map(featuredCatalogOrder.map((legacyId, index) => [legacyId, index]));
    rows.sort((a, b) => {
      const aOrder = order.get(a.legacy_id) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = order.get(b.legacy_id) ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }

  return rows.map(mapProduct);
}

export async function listCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function listAdminCatalog() {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories!inner(id, name, slug), product_variants(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createCatalogProduct(product, variants = []) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select("id")
    .single();
  if (error) throw error;
  if (variants.length) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variants.map((variant, index) => ({ ...variant, product_id: data.id, sort_order: index })));
    if (variantError) throw variantError;
  }
  return data.id;
}

export async function updateCatalogProduct(id, product, variants = []) {
  const { error } = await supabase.from("products").update(product).eq("id", id);
  if (error) throw error;
  const { error: deactivateError } = await supabase
    .from("product_variants")
    .update({ active: false })
    .eq("product_id", id);
  if (deactivateError) throw deactivateError;
  if (variants.length) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .upsert(variants.map((variant, index) => ({ ...variant, product_id: id, sort_order: index, active: true })), { onConflict: "product_id,legacy_key" });
    if (variantError) throw variantError;
  }
}

export async function removeCatalogProduct(id) {
  const { error } = await supabase.from("products").update({ active: false }).eq("id", id);
  if (error) throw error;
}
