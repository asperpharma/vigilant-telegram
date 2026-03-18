import fs from "fs";

const CSV_PATH =
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/1-3999 pro (1).csv";

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { // Handle escaped quotes
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function validateCSV() {
  console.log("Starting White Glove Product Integrity Audit...");

  if (!fs.existsSync(CSV_PATH)) {
    console.error("Master CSV not found at:", CSV_PATH);
    return;
  }

  const fileData = fs.readFileSync(CSV_PATH, "utf8");
  const lines = fileData.split(/\r?\n/).filter((line) =>
    line.trim().length > 0
  );
  if (lines.length === 0) return;

  const headers = parseCSVLine(lines[0]);

  // Find column indices
  const titleIdx = headers.findIndex((h) => h.toLowerCase() === "title");
  const handleIdx = headers.findIndex((h) => h.toLowerCase() === "handle");
  const bodyIdx = headers.findIndex((h) =>
    h.toLowerCase().includes("body (html)") || h.toLowerCase() === "body"
  );
  const typeIdx = headers.findIndex((h) => h.toLowerCase() === "type");
  const tagsIdx = headers.findIndex((h) => h.toLowerCase() === "tags");

  const imageIndices = headers.reduce((acc, h, i) => {
    if (
      h.toLowerCase().includes("image src") ||
      h.toLowerCase().includes("images/0/src")
    ) {
      acc.push(i);
    }
    return acc;
  }, []);

  const priceIndices = headers.reduce((acc, h, i) => {
    if (
      h.toLowerCase().includes("variant price") ||
      h.toLowerCase().includes("variants/0/price")
    ) {
      acc.push(i);
    }
    return acc;
  }, []);

  console.log(`Auditing ${lines.length - 1} entries...`);

  const issues = [];
  const handledProducts = new Set();
  const duplicateHandles = new Set();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const handle = values[handleIdx];
    const title = values[titleIdx];

    // Shopify logic: if Title/Handle is empty, it's a variant of the previous row.
    // We only audit the product definition (the first row of a product).
    if (!handle && !title) continue;

    const productId = handle || title;
    if (handledProducts.has(productId)) {
      // This shouldn't happen in a clean export if handle is unique,
      // but if it does, it's a "Duplicate Handle" issue.
      duplicateHandles.add(productId);
      continue;
    }
    handledProducts.add(productId);

    const productTitle = title || handle;
    const rowIndex = i + 1;

    // 1. Image Audit
    let hasValidImage = false;
    for (const idx of imageIndices) {
      const src = values[idx];
      if (src && src.startsWith("http")) {
        hasValidImage = true;
        if (
          src.includes("thumbnail") || src.includes("_small") ||
          src.includes("100x100")
        ) {
          issues.push(
            `[ROW ${rowIndex}] QUALITY: Low-res image for "${productTitle}"`,
          );
        }
      }
    }
    if (!hasValidImage) {
      issues.push(
        `[ROW ${rowIndex}] MISSING IMAGE: No valid image URL for "${productTitle}"`,
      );
    }

    // 2. Price Audit
    let hasPrice = false;
    for (const idx of priceIndices) {
      const price = values[idx];
      if (price && parseFloat(price) > 0) {
        hasPrice = true;
      }
    }
    if (!hasPrice) {
      issues.push(
        `[ROW ${rowIndex}] PRICE: Missing or zero price for "${productTitle}"`,
      );
    }

    // 3. Organic/Ingredients Audit
    const tags = values[tagsIdx] || "";
    const type = values[typeIdx] || "";
    const body = values[bodyIdx] || "";
    if (
      tags.toLowerCase().includes("organic") ||
      type.toLowerCase().includes("organic")
    ) {
      if (!body || body.length < 50) {
        issues.push(
          `[ROW ${rowIndex}] CONTENT: Organic product "${productTitle}" missing ingredients/info`,
        );
      }
    }
  }

  duplicateHandles.forEach((h) => {
    issues.push(`CRITICAL: Duplicate Handle detected in catalog: ${h}`);
  });

  console.log("-----------------------------------------");
  if (issues.length === 0) {
    console.log("RESULT: CLEAN AUDIT PASSED. Site is ready for Jordan Launch.");
  } else {
    console.log(`RESULT: AUDIT FAILED with ${issues.length} potential issues.`);
    console.log("Sample of snags:");
    issues.slice(0, 50).forEach((msg) => console.log(msg));
    if (issues.length > 50) console.log(`... and ${issues.length - 50} more.`);
  }
  console.log("-----------------------------------------");
}

validateCSV();
