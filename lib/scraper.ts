import * as cheerio from "cheerio";

export interface ScrapedData {
  title: string | null;
  price: number | null;
  imageUrl: string | null;
  description: string | null;
  currency: string | null;
}

/**
 * Scrape metadata from a URL: title, price, image, and description.
 * Uses cheerio for HTML parsing with a 5-second timeout.
 */
export async function scrapeUrl(url: string): Promise<ScrapedData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="title"]').attr("content") ||
      $("title").text() ||
      $("h1").first().text() ||
      null;

    // Extract image
    const imageUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('link[rel="image_src"]').attr("href") ||
      $("img.product-image, img#landingImage, img.DI_image").first().attr("src") ||
      null;

    // Extract description
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      null;

    // Extract price — try multiple strategies
    const price = extractPrice($);

    // Try to detect currency
    const currency = extractCurrency($);

    return {
      title: title?.trim() || null,
      price,
      imageUrl: imageUrl ? resolveUrl(imageUrl, url) : null,
      description: description?.trim() || null,
      currency,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return {
      title: null,
      price: null,
      imageUrl: null,
      description: null,
      currency: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractPrice($: cheerio.CheerioAPI): number | null {
  // JSON-LD schema
  const jsonLdScripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < jsonLdScripts.length; i++) {
    try {
      const data = JSON.parse($(jsonLdScripts[i]).html() || "");
      const price = findPriceInJson(data);
      if (price) return price;
    } catch {
      // ignore parse errors
    }
  }

  // Meta tags
  const metaPrice =
    $('meta[property="product:price:amount"]').attr("content") ||
    $('meta[property="og:price:amount"]').attr("content") ||
    $('meta[itemprop="price"]').attr("content");
  if (metaPrice) {
    const parsed = parsePrice(metaPrice);
    if (parsed) return parsed;
  }

  // Common CSS selectors
  const priceSelectors = [
    '[itemprop="price"]',
    ".price",
    ".product-price",
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    ".a-price .a-offscreen",
    "._30jeq3", // Flipkart
    ".Nx9bqj", // Flipkart new
    ".pdp-price",
    ".price-current",
    '[data-testid="price"]',
    ".offer-price",
    ".selling-price",
  ];

  for (const selector of priceSelectors) {
    const el = $(selector).first();
    const text = el.attr("content") || el.text();
    if (text) {
      const parsed = parsePrice(text);
      if (parsed) return parsed;
    }
  }

  return null;
}

function extractCurrency($: cheerio.CheerioAPI): string | null {
  const currencyMeta =
    $('meta[property="product:price:currency"]').attr("content") ||
    $('meta[property="og:price:currency"]').attr("content");
  if (currencyMeta) return currencyMeta;

  // Check for common currency symbols in the page
  const bodyText = $("body").text();
  if (/₹/.test(bodyText)) return "INR";
  if (/\$/.test(bodyText)) return "USD";
  if (/€/.test(bodyText)) return "EUR";
  if (/£/.test(bodyText)) return "GBP";

  return null;
}

function findPriceInJson(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;

  if (obj.price !== undefined) {
    const parsed = parsePrice(String(obj.price));
    if (parsed) return parsed;
  }

  if (obj.offers) {
    const offers = Array.isArray(obj.offers) ? obj.offers : [obj.offers];
    for (const offer of offers) {
      if (typeof offer === "object" && offer !== null) {
        const offerObj = offer as Record<string, unknown>;
        if (offerObj.price !== undefined) {
          const parsed = parsePrice(String(offerObj.price));
          if (parsed) return parsed;
        }
        if (offerObj.lowPrice !== undefined) {
          const parsed = parsePrice(String(offerObj.lowPrice));
          if (parsed) return parsed;
        }
      }
    }
  }

  // Recurse
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      const result = findPriceInJson(obj[key]);
      if (result) return result;
    }
  }

  return null;
}

function parsePrice(text: string): number | null {
  // Remove currency symbols, commas, spaces
  const cleaned = text.replace(/[₹$€£¥,\s]/g, "").trim();
  const match = cleaned.match(/(\d+\.?\d*)/);
  if (match) {
    const num = parseFloat(match[1]);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
}

function resolveUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}
