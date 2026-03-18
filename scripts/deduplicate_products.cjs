const fs = require("fs");
const path = require("path");

const DIRS = [
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify",
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/Asper online Shop data",
];

const OUTPUT_FILE =
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/FINAL_Asper_Catalog_82k.csv";

function getHandleFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/products\/([^/?#]+)/);
  return match ? match[1] : null;
}

function parseCSV(data) {
  const rows = [];
  let curRow = [];
  let curCell = "";
  let inQuote = false;

  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (char === '"') {
      if (inQuote && data[i + 1] === '"') {
        curCell += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (char === "," && !inQuote) {
      curRow.push(curCell);
      curCell = "";
    } else if ((char === "\n" || char === "\r") && !inQuote) {
      if (char === "\r" && data[i + 1] === "\n") i++;
      curRow.push(curCell);
      if (curRow.length > 1 || curRow[0] !== "") {
        rows.push(curRow);
      }
      curRow = [];
      curCell = "";
    } else {
      curCell += char;
    }
  }
  if (curRow.length > 0 || curCell !== "") {
    curRow.push(curCell);
    rows.push(curRow);
  }
  return rows;
}

async function run() {
  const productMap = new Map();
  let totalRowsProcessed = 0;

  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue;
    console.log(`Scanning directory: ${dir}`);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));

    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fullPath === OUTPUT_FILE) continue;

      console.log(`  Reading ${file}...`);
      let data;
      try {
        data = fs.readFileSync(fullPath, "utf8");
      } catch (e) {
        continue;
      }

      const rows = parseCSV(data);
      if (rows.length === 0) continue;

      const headers = rows[0].map((h) => h.toLowerCase().trim());
      const colIndices = {
        vendor: headers.indexOf("brand") !== -1
          ? headers.indexOf("brand")
          : (headers.indexOf("vendor") !== -1 ? headers.indexOf("vendor") : -1),
        category: headers.indexOf("categories/0") !== -1
          ? headers.indexOf("categories/0")
          : (headers.indexOf("type") !== -1
            ? headers.indexOf("type")
            : (headers.indexOf("producttype") !== -1
              ? headers.indexOf("producttype")
              : -1)),
        description: headers.indexOf("description") !== -1
          ? headers.indexOf("description")
          : (headers.indexOf("body (html)") !== -1
            ? headers.indexOf("body (html)")
            : (headers.indexOf("descriptionhtml") !== -1
              ? headers.indexOf("descriptionhtml")
              : -1)),
        imageUrl: headers.indexOf("medias/0/url") !== -1
          ? headers.indexOf("medias/0/url")
          : (headers.indexOf("image src") !== -1
            ? headers.indexOf("image src")
            : (headers.indexOf("src") !== -1 ? headers.indexOf("src") : -1)),
        url: headers.indexOf("source/canonicalurl") !== -1
          ? headers.indexOf("source/canonicalurl")
          : (headers.indexOf("url") !== -1
            ? headers.indexOf("url")
            : (headers.indexOf("producturl") !== -1
              ? headers.indexOf("producturl")
              : -1)),
        title: headers.indexOf("title"),
        handle: headers.indexOf("handle"),
      };

      let currentHandle = null;
      let fileHandles = new Set();

      for (let j = 1; j < rows.length; j++) {
        const row = rows[j];
        totalRowsProcessed++;

        let handle = "";
        if (colIndices.handle !== -1 && row[colIndices.handle]) {
          handle = row[colIndices.handle].trim();
        } else if (colIndices.url !== -1 && row[colIndices.url]) {
          handle = getHandleFromUrl(row[colIndices.url]);
        }

        if (!handle && currentHandle) {
          handle = currentHandle;
        } else if (handle) {
          currentHandle = handle;
        }

        if (!handle && colIndices.title !== -1 && row[colIndices.title]) {
          handle = row[colIndices.title].toLowerCase().replace(
            /[^a-z0-9]+/g,
            "-",
          ).replace(/(^-|-$)/g, "");
          currentHandle = handle;
        }

        if (!handle) continue;
        fileHandles.add(handle);

        const hasCategory =
          colIndices.category !== -1 && row[colIndices.category] &&
            row[colIndices.category].trim() !== ""
            ? 1
            : 0;
        const hasImage =
          colIndices.imageUrl !== -1 && row[colIndices.imageUrl] &&
            row[colIndices.imageUrl].trim() !== ""
            ? 1
            : 0;
        const descLen =
          colIndices.description !== -1 && row[colIndices.description]
            ? row[colIndices.description].length
            : 0;

        const score = (hasCategory * 2000) + (hasImage * 1000) + descLen;

        if (!productMap.has(handle) || score > productMap.get(handle).score) {
          productMap.set(handle, {
            title: row[colIndices.title] ||
              (productMap.get(handle) ? productMap.get(handle).title : ""),
            vendor: row[colIndices.vendor] ||
              (productMap.get(handle) ? productMap.get(handle).vendor : ""),
            category: row[colIndices.category] ||
              (productMap.get(handle) ? productMap.get(handle).category : ""),
            description: row[colIndices.description] ||
              (productMap.get(handle)
                ? productMap.get(handle).description
                : ""),
            imageUrl: row[colIndices.imageUrl] ||
              (productMap.get(handle) ? productMap.get(handle).imageUrl : ""),
            score,
          });
        }
      }
      console.log(
        `    File: ${file}. Rows: ${rows.length}. File Uniques: ${fileHandles.size}. Global: ${productMap.size}`,
      );
    }
  }

  console.log(
    `Finished processing. Total rows: ${totalRowsProcessed}. Total unique products: ${productMap.size}`,
  );

  const writeStream = fs.createWriteStream(OUTPUT_FILE);
  writeStream.write(
    "Handle,Title,Vendor,Category,Description,Image URL,Score\n",
  );
  for (const [handle, p] of productMap) {
    const line = [
      handle,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${(p.vendor || "").replace(/"/g, '""')}"`,
      `"${(p.category || "").replace(/"/g, '""')}"`,
      `"${(p.description || "").replace(/"/g, '""')}"`,
      `"${(p.imageUrl || "").replace(/"/g, '""')}"`,
      p.score,
    ].join(",");
    writeStream.write(line + "\n");
  }
  writeStream.end();
}

run().catch(console.error);
