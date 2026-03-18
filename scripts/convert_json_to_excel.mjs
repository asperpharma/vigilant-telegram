import fs from "fs";
import ExcelJS from "exceljs";

const jsonPath =
  "C:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/dataset_productss_2026-01-15_23-29-45-343.json";
const outputPath =
  "C:/Users/C-R/Desktop/Asper Beauty Box/lovable/products_for_upload.xlsx";

console.log("Loading JSON file...");
const rawData = fs.readFileSync(jsonPath, "utf8");
const products = JSON.parse(rawData);

console.log(`Found ${products.length} products`);

// Create workbook
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Products");

// Add headers
worksheet.columns = [
  { header: "SKU", key: "sku", width: 20 },
  { header: "Product Name", key: "name", width: 50 },
  { header: "Cost Price", key: "costPrice", width: 15 },
  { header: "Selling Price", key: "sellingPrice", width: 15 },
];

// Convert products
let count = 0;
for (const product of products) {
  // Extract price from variants
  let currentPrice = 0;
  let costPrice = 0;

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants[0];
    if (variant.price?.current) {
      currentPrice = parseFloat(variant.price.current) / 100; // Convert from cents
    }
    if (variant.price?.previous) {
      costPrice = parseFloat(variant.price.previous) / 100;
    }
  }

  // Use source ID as SKU
  const sku = product.source?.id?.toString() || `PROD-${count + 1}`;

  worksheet.addRow({
    sku: sku,
    name: product.title || "Untitled Product",
    costPrice: costPrice > 0 ? costPrice : currentPrice * 0.7, // Estimate 30% margin
    sellingPrice: currentPrice > 0 ? currentPrice : 10.0, // Default price
  });

  count++;
}

// Save to Excel
console.log(`Saving to ${outputPath}...`);
await workbook.xlsx.writeFile(outputPath);

console.log(`✅ Successfully converted ${count} products to Excel!`);
console.log(`📁 File saved to: ${outputPath}`);
console.log(`\nColumn mapping:`);
console.log(`  - SKU: Product identifier`);
console.log(`  - Product Name: Full product title`);
console.log(`  - Cost Price: Cost/previous price`);
console.log(`  - Selling Price: Current selling price`);
