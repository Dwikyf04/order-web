import { supabase } from "../../lib/supabaseClient";

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
    variants: (row.product_variants || []).map((variant) => ({
      id: variant.id,
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
  return (data || []).map(mapProduct);
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
