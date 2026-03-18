import fs from "fs";
import readline from "readline";

const CSV_PATH =
  "c:/Users/C-R/Desktop/Asper Beauty Box/Asper Beauty shop prodcuts/product apify/1-3999 pro (1).csv";

async function findBodyHtml() {
  const fileStream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({ input: fileStream });

  for await (const line of rl) {
    const headers = line.split(",").map((h) => h.replace(/"/g, "").trim());
    const idx = headers.findIndex((h) => h.toLowerCase().includes("body"));
    if (idx !== -1) {
      console.log(`FOUND BODY: "${headers[idx]}" at index ${idx}`);
    }
    const idx2 = headers.findIndex((h) => h.toLowerCase().includes("html"));
    if (idx2 !== -1) {
      console.log(`FOUND HTML: "${headers[idx2]}" at index ${idx2}`);
    }
    break;
  }
  rl.close();
}

findBodyHtml();
