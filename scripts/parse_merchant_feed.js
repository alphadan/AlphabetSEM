import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feedUrl = "https://www.alphabetsigns.com/google-product-feed.html";
const outputPath = path.join(
  __dirname,
  "../reports/merchant_center/products.json",
);

function getTagContent(itemString, tagName) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = itemString.match(regex);
  if (!match) return "";

  let content = match[1].trim();
  content = content.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/g, "$1").trim();
  return content;
}

async function fetchAndParseFeed() {
  console.log("====================================================");
  console.log("    AlphabetSEM - Complete Google Feed Parser       ");
  console.log("====================================================");
  console.log(`🌐 Fetching live feed: ${feedUrl}...`);

  try {
    const res = await fetch(feedUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const xmlText = await res.text();
    const items = xmlText.split("<item>").slice(1);

    console.log(`📊 Parsing all properties for ${items.length} products...`);

    const productsList = [];

    items.forEach((itemString, index) => {
      productsList.push({
        id:
          getTagContent(itemString, "g:id") ||
          getTagContent(itemString, "id") ||
          `PROD-${index}`,
        title:
          getTagContent(itemString, "title") ||
          getTagContent(itemString, "g:title"),
        description: getTagContent(itemString, "description")
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim(),
        link: getTagContent(itemString, "link"),
        image:
          getTagContent(itemString, "g:image_link") ||
          getTagContent(itemString, "image_link"),
        price:
          getTagContent(itemString, "g:price") ||
          getTagContent(itemString, "price"),
        brand: getTagContent(itemString, "g:brand") || "Alphabet Signs",
        mpn:
          getTagContent(itemString, "g:mpn") ||
          getTagContent(itemString, "mpn") ||
          "N/A",
        gtin:
          getTagContent(itemString, "g:gtin") ||
          getTagContent(itemString, "gtin") ||
          "N/A",
        condition: getTagContent(itemString, "g:condition") || "new",
        availability: getTagContent(itemString, "g:availability") || "in_stock",
        category:
          getTagContent(itemString, "g:product_type") || "General Signs",
        shippingWeight: getTagContent(itemString, "g:shipping_weight") || "N/A",
        shippingCost: getTagContent(itemString, "g:shipping")
          ? getTagContent(getTagContent(itemString, "g:shipping"), "g:price")
          : "N/A",
        custom_label_0: getTagContent(itemString, "g:custom_label_0") || "N/A",
        custom_label_1: getTagContent(itemString, "g:custom_label_1") || "N/A",
        custom_label_2: getTagContent(itemString, "g:custom_label_2") || "N/A",
      });
    });

    fs.writeFileSync(outputPath, JSON.stringify(productsList, null, 2), "utf8");

    console.log("\n====================================================");
    console.log(`✅ SUCCESS! All product attributes written to disk.`);
    console.log(`📁 Target: ${outputPath}`);
    console.log("====================================================");
  } catch (error) {
    console.error("❌ Error parsing feed:", error);
  }
}

fetchAndParseFeed();
