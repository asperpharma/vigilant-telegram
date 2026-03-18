import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Using anon key, hope RLS is permissive or I have service key

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const JSON_PATH =
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/dataset_productss_2026-01-15_23-29-45-343.json";

async function importProducts() {
  console.log("Reading JSON file...");
  const rawData = fs.readFileSync(JSON_PATH, "utf8");
  const products = JSON.parse(rawData);
  console.log(`Found ${products.length} products to import.`);

  // Clear existing products first (optional, but good for a fresh start since we can't upsert without unique key)
  console.log("Clearing existing products...");
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (deleteError) {
    console.warn(
      "Could not clear products (might be RLS):",
      deleteError.message,
    );
  }

  const batchSize = 50; // Smaller batches for safety
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    const mappedBatch = batch.map((p) => {
      const currentPrice = p.variants?.[0]?.price?.current
        ? parseFloat(p.variants[0].price.current) / 100
        : 0;
      const previousPrice = p.variants?.[0]?.price?.previous
        ? parseFloat(p.variants[0].price.previous) / 100
        : null;
      const isOnSale = previousPrice && previousPrice > currentPrice;
      const discountPercent = isOnSale
        ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
        : 0;

      const tags = p.tags || [];
      const skinConcerns = tags.filter((t) =>
        t &&
        (t.toLowerCase().includes("skin") || t.toLowerCase().includes("acne"))
      );

      return {
        title: p.title,
        price: currentPrice,
        description: p.description,
        category: p.categories?.[0] || "Uncategorized",
        subcategory: null,
        image_url: p.medias?.[0]?.url,
        brand: p.brand,
        volume_ml: p.variants?.[0]?.title !== "Default Title"
          ? p.variants?.[0]?.title
          : null,
        is_on_sale: isOnSale,
        original_price: previousPrice,
        discount_percent: discountPercent,
        tags: tags,
        skin_concerns: skinConcerns,
        source_url: p.source?.canonicalUrl,
        updated_at: new Date().toISOString(),
      };
    });

    console.log(
      `Importing batch ${Math.floor(i / batchSize) + 1} (${i} to ${
        i + mappedBatch.length
      })...`,
    );

    const { error } = await supabase
      .from("products")
      .insert(mappedBatch);

    if (error) {
      console.error("Error importing batch:", error.message);
    }
  }

  console.log("Import completed.");
}

importProducts().catch(console.error);
