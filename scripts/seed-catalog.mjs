import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import vm from "node:vm";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.argv.includes("--dry-run");

if (!dryRun && (!supabaseUrl || !serviceRoleKey)) {
  throw new Error(
    "Set SUPABASE_URL and SUPABASE_SECRET_KEY before running the catalog seed."
  );
}

function loadLegacyProducts(source) {
  const imports = new Map();
  const withoutImports = source.replace(
    /import\s+(\w+)\s+from\s+["']\.\.\/assets\/products\/([^"']+)["'];?/g,
    (_, alias, filename) => {
      const relativePath = path.join("src", "assets", "products", filename);
      imports.set(alias, relativePath);
      return `const ${alias} = ${JSON.stringify(relativePath)};`;
    }
  );

  const executable = withoutImports
    .replace("export const products =", "const products =")
    .concat("\nproducts;");
  const products = vm.runInNewContext(executable, { console });
  return { products, imports };
}

async function uploadImage(supabase, bucket, relativePath, cache) {
  if (!relativePath) return null;
  if (cache.has(relativePath)) return cache.get(relativePath);

  const filePath = path.resolve(root, relativePath);
  const file = await fs.readFile(filePath);
  const version = crypto.createHash("sha1").update(file).digest("hex").slice(0, 12);
  const objectPath = relativePath.replaceAll("\\", "/");
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(objectPath, file, { upsert: true, contentType: contentType(filePath) });

  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  const versionedUrl = `${data.publicUrl}?v=${version}`;
  cache.set(relativePath, versionedUrl);
  return versionedUrl;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return extension === ".png"
    ? "image/png"
    : extension === ".jpeg" || extension === ".jpg"
      ? "image/jpeg"
      : extension === ".webp"
        ? "image/webp"
        : "application/octet-stream";
}

const source = await fs.readFile(path.resolve(root, "src/data/products.js"), "utf8");
const { products } = loadLegacyProducts(source);
const ids = products.map((product) => product.id);
if (new Set(ids).size !== ids.length) {
  throw new Error("Legacy product IDs must be unique before seeding.");
}

if (dryRun) {
  console.log(`Catalog source valid: ${products.length} products, ${ids.length} unique legacy IDs.`);
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
const bucket = "product-images";
await supabase.storage.createBucket(bucket, { public: true }).catch(() => undefined);

const categoryNames = [...new Set(products.map((product) => product.category))];
const { data: categoryRows, error: categoryError } = await supabase
  .from("categories")
  .upsert(
    categoryNames.map((name, index) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      sort_order: index,
    })),
    { onConflict: "slug" }
  )
  .select();
if (categoryError) throw categoryError;

const categoryByName = new Map(categoryRows.map((row) => [row.name, row.id]));
const imageCache = new Map();

for (const [index, product] of products.entries()) {
  const { data: row, error } = await supabase
    .from("products")
    .upsert(
      {
        legacy_id: product.id,
        category_id: categoryByName.get(product.category),
        name: product.nama,
        description: product.spesifikasi || "",
        unit: product.satuan || "Unit",
        base_price: product.price,
        image_url: await uploadImage(supabase, bucket, product.img, imageCache),
        active: true,
        is_featured: [90, 2, 92, 29, 93, 91, 35, 94, 95, 97, 98, 99, 100, 101].includes(product.id),
        sort_order: product.sortOrder ?? index,
      },
      { onConflict: "legacy_id" }
    )
    .select("id")
    .single();
  if (error) throw error;

  for (const [variantIndex, variant] of (product.variants || []).entries()) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .upsert(
        {
          product_id: row.id,
          legacy_key: variant.key || variant.name,
          name: variant.name,
          price: variant.price,
          image_url: await uploadImage(supabase, bucket, variant.img, imageCache),
          active: true,
          sort_order: variantIndex,
        },
        { onConflict: "product_id,legacy_key" }
      );
    if (variantError) throw variantError;
  }

  const currentVariantKeys = (product.variants || []).map((variant) => variant.key || variant.name);
  const { data: existingVariants, error: existingVariantsError } = await supabase
    .from("product_variants")
    .select("id, legacy_key")
    .eq("product_id", row.id);
  if (existingVariantsError) throw existingVariantsError;
  for (const existingVariant of existingVariants || []) {
    if (!currentVariantKeys.includes(existingVariant.legacy_key)) {
      const { error: deactivateError } = await supabase
        .from("product_variants")
        .update({ active: false })
        .eq("id", existingVariant.id);
      if (deactivateError) throw deactivateError;
    }
  }

  console.log(`Seeded ${index + 1}/${products.length}: ${product.nama}`);
}

const { data: existingProducts, error: existingProductsError } = await supabase
  .from("products")
  .select("id, legacy_id")
  .not("legacy_id", "is", null);
if (existingProductsError) throw existingProductsError;

for (const existingProduct of existingProducts || []) {
  if (!ids.includes(existingProduct.legacy_id)) {
    const { error: deactivateError } = await supabase
      .from("products")
      .update({ active: false })
      .eq("id", existingProduct.id);
    if (deactivateError) throw deactivateError;
    console.log(`Deactivated stale catalog product legacy_id=${existingProduct.legacy_id}`);
  }
}

console.log(`Catalog seed complete: ${products.length} products.`);
