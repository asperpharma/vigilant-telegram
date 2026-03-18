const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

/**
 * RE-UPLOAD CATALOG UTILITY
 *
 * Part of the Zero-Defect Deployment Protocol for Asper Beauty Box.
 * Handles idempotent upserts of product data.
 */

const CSV_FILE =
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/FINAL_Asper_Catalog_82k.csv";
const BATCH_SIZE = 50;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: Missing Supabase configuration in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSVLine(line) {
  const result = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuote = !inQuote;
    } else if (char === "," && !inQuote) {
      result.push(cur);
      cur = "";
    } else cur += char;
  }
  result.push(cur);
  return result;
}

// Simple categorization logic
const CATEGORY_KEYWORDS = {
  "skin-care": [
    "cleanser",
    "toner",
    "serum",
    "moisturizer",
    "cream",
    "face",
    "facial",
    "skin",
  ],
  "hair-care": [
    "hair",
    "shampoo",
    "conditioner",
    "treatment",
    "oil",
    "mask",
    "scalp",
  ],
  "make-up": [
    "mascara",
    "lipstick",
    "foundation",
    "eyeshadow",
    "blush",
    "concealer",
  ],
  "body-care": ["body", "lotion", "scrub", "wash", "soap", "hand"],
  "fragrances": ["perfume", "fragrance", "cologne", "mist", "eau de"],
};

function autoCategorize(title) {
  const text = (title || "").toLowerCase();
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return slug;
  }
  return "skin-care";
}

async function run() {
  console.log("--- Phase 1: Pre-Flight Check ---");
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`Missing CSV file at ${CSV_FILE}`);
    return;
  }

  // Try a simple select to verify column access
  const { data: testData, error: testError } = await supabase.from("products")
    .select("*").limit(1);
  if (testError) {
    console.error("Initial DB check failed:", testError.message);
    // We will try to proceed anyway, sometimes SELECT fails while UPSERT works if cache is stale
  } else {
    console.log("Database connection verified.");
    if (testData && testData.length > 0) {
      console.log(
        "Existing columns found:",
        Object.keys(testData[0]).join(", "),
      );
    }
  }

  const content = fs.readFileSync(CSV_FILE, "utf8");
  const lines = content.split(/\r?\n/);
  console.log(`Processing ${lines.length - 1} records...`);

  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);

    const handle = row[0];
    const title = row[1];
    const vendor = row[2];
    let category = row[3];
    const description = row[4];
    const imageUrl = row[5];

    if (!category || category === '""' || category.length < 2) {
      category = autoCategorize(title);
    }

    products.push({
      external_id: handle,
      title: title || "Untitled Product",
      brand: vendor,
      category: category,
      description: description,
      image_url: imageUrl,
      price: 0,
      updated_at: new Date().toISOString(),
    });
  }

  console.log(`--- Phase 2: Upserting ${products.length} Products ---`);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("products").upsert(batch, {
      onConflict: "external_id",
      // Note: We are using the column name from our migration
    });

    if (error) {
      console.error(`\nBatch ${i / BATCH_SIZE} failed:`, error.message);
      failCount += batch.length;
    } else {
      successCount += batch.length;
      process.stdout.write(
        `\rProgress: ${successCount} / ${products.length} products upserted...`,
      );
    }
  }

  console.log("\n--- Phase 3: Final Verification ---");
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log("Import Routine Finished.");
}

run().catch(console.error);
