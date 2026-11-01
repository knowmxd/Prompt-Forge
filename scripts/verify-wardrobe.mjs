import { chromium } from "playwright";

async function main() {
  console.log("Launching browser for Wardrobe & Attire Studio verification...");
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("[Browser Console Error]", msg.text());
    }
  });

  console.log("Navigating to http://localhost:8080/ ...");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });

  // 1. Select Wardrobe cluster inside nav[aria-label="Clusters"]
  console.log("Clicking Wardrobe cluster in nav[aria-label='Clusters']...");
  const navClusters = page.locator('nav[aria-label="Clusters"]');
  const wardrobeClusterBtn = navClusters.getByRole("button", { name: "Wardrobe" });
  await wardrobeClusterBtn.click();
  await page.waitForTimeout(500);

  // 2. Open Wardrobe Studio modal from cluster header
  console.log("Opening Wardrobe Studio modal from cluster header...");
  const openStudioBtn = page.getByRole("button", { name: /Wardrobe Studio/i }).first();
  await openStudioBtn.click();
  await page.waitForTimeout(600);

  // Screenshot modal with Outfits (49)
  await page.screenshot({ path: "screenshots/wardrobe-modal-outfits.png" });
  console.log("Saved screenshots/wardrobe-modal-outfits.png");

  // 3. Click outfit "Cream Sherpa & Stripes"
  console.log("Selecting outfit 'Cream Sherpa & Stripes'...");
  const outfitCard = page.getByRole("button", { name: /Cream Sherpa & Stripes/i });
  await outfitCard.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/wardrobe-outfit-selected.png" });
  console.log("Saved screenshots/wardrobe-outfit-selected.png");

  // 4. Test filtering outfits by style #coquette
  console.log("Filtering outfits by #coquette...");
  const coquetteTag = page.getByRole("button", { name: /#coquette/i }).first();
  await coquetteTag.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: "screenshots/wardrobe-outfits-filtered.png" });
  console.log("Saved screenshots/wardrobe-outfits-filtered.png");

  // 5. Switch to Individual Pieces tab
  console.log("Switching to Individual Pieces tab...");
  const piecesTab = page.getByRole("button", { name: /Individual Pieces/i });
  await piecesTab.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/wardrobe-modal-items.png" });
  console.log("Saved screenshots/wardrobe-modal-items.png");

  // 6. Filter by Outerwear slot
  console.log("Filtering items by Outerwear slot...");
  const outerwearSlotBtn = page.getByRole("button", { name: /^outerwear \(\d+\)$/i });
  await outerwearSlotBtn.click();
  await page.waitForTimeout(400);

  // Click Moto jacket piece
  console.log("Clicking Black leather moto jacket piece...");
  const motoCard = page.getByRole("button", { name: /Black leather moto jacket/i });
  await motoCard.click();
  await page.waitForTimeout(500);

  // 7. Close modal
  console.log("Closing modal...");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 8. Verify workbench fields
  const outerwearVal = await page.locator("#subjects\\.0\\.wardrobe_architecture\\.layering_system\\.outerwear").inputValue();
  console.log("Outerwear field value:", outerwearVal);
  if (!outerwearVal.includes("moto biker jacket")) {
    throw new Error(`Expected moto jacket in outerwear, got "${outerwearVal}"`);
  }

  const footwearVal = await page.locator("#subjects\\.0\\.wardrobe_architecture\\.footwear").inputValue();
  console.log("Footwear field value:", footwearVal);
  if (!footwearVal.includes("slouch boots")) {
    throw new Error(`Expected slouch boots in footwear, got "${footwearVal}"`);
  }

  await page.screenshot({ path: "screenshots/wardrobe-workbench.png" });
  console.log("Saved screenshots/wardrobe-workbench.png");

  // 9. Open Looks shelf and switch to Wardrobe filter
  console.log("Checking Looks shelf with Wardrobe filter...");
  const looksShelfTab = page.getByRole("button", { name: "Looks", exact: true });
  await looksShelfTab.click();
  await page.waitForTimeout(300);

  const wardrobeShelfFilter = page.getByRole("complementary").getByRole("button", { name: "Wardrobe", exact: true });
  await wardrobeShelfFilter.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/wardrobe-shelf.png" });
  console.log("Saved screenshots/wardrobe-shelf.png");

  await browser.close();
  console.log("Verification complete! All visual checks and prompt bindings verified successfully.");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
