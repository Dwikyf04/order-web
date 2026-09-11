import { supabase } from "../../lib/supabaseClient";

export async function getPublicSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("key", "public");
  if (error) throw error;
  return (data || []).reduce(
    (result, setting) => ({ ...result, ...(setting.value || {}) }),
    {}
  );
}

export async function listBrandPartners(type) {
  let query = supabase
    .from("brand_partners")
    .select("id, type, name, image_url, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
