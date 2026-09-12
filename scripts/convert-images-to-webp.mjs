import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetDir = path.join(root, "src", "assets", "products");
const sourceFile = path.join(root, "src", "data", "products.js");
const supported = new Set([".jpg", ".jpeg", ".png"]);
const files = await fs.readdir(assetDir, { withFileTypes: true });
let converted = 0;

for (const file of files) {
  if (!file.isFile() || !supported.has(path.extname(file.name).toLowerCase())) continue;
  const source = path.join(assetDir, file.name);
  const sourceName = path.basename(file.name, path.extname(file.name));
  const outputName = sourceName.replace(/-png$/i, "");
  const output = path.join(assetDir, `${outputName}.webp`);
  await sharp(source).webp({ quality: 82, effort: 4 }).toFile(output);
  converted += 1;
}

let source = await fs.readFile(sourceFile, "utf8");
source = source.replace(
  /((?:\.\.\/assets\/products\/)[^"']+?)\.(?:jpg|jpeg|png)(["'])/gi,
  "$1.webp$2",
);
await fs.writeFile(sourceFile, source);
console.log(`Converted ${converted} catalog images to WebP and updated imports.`);
