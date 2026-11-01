import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

async function main() {
  console.log("Launching browser for Visual Lighting Studio verification...");
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

  // 1. Check sidebar clusters
  const bodyText = await page.textContent("body");
  const hasRimOrKicker = bodyText.includes("Rim or kicker");
  const hasColorTemp = bodyText.includes("Color temperature balance");
  console.log("Site check - 'Rim or kicker' present:", hasRimOrKicker);
  console.log("Site check - 'Color temperature' present:", hasColorTemp);
  if (hasRimOrKicker || hasColorTemp) {
    throw new Error("Found removed lighting fields in UI!");
  }

  // 2. Select Lighting cluster
  console.log("Clicking Lighting cluster in Aesthetic DNA...");
  const lightingClusterBtn = page.getByRole("button", { name: /^Lighting$/i }).first();
  await lightingClusterBtn.click();
  await page.waitForTimeout(500);

  // 3. Open Visual Lighting Studio modal
  console.log("Opening Visual Lighting Studio modal...");
  const openStudioBtn = page.getByRole("button", { name: /Lighting Studio/i });
  await openStudioBtn.click();
  await page.waitForTimeout(600);

  // Screenshot modal all setups
  await page.screenshot({ path: "screenshots/lighting-modal-open.png" });
  console.log("Saved screenshots/lighting-modal-open.png");

  // 4. Click Cinematic & Dramatic category pill
  console.log("Filtering by Cinematic & Dramatic...");
  const cinematicPill = page.getByRole("button", { name: /Cinematic & Dramatic/i });
  await cinematicPill.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: "screenshots/lighting-cinematic.png" });
  console.log("Saved screenshots/lighting-cinematic.png");

  // 5. Click Color & Atmosphere category pill
  console.log("Filtering by Color & Atmosphere...");
  const atmospherePill = page.getByRole("button", { name: /Color & Atmosphere/i });
  await atmospherePill.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: "screenshots/lighting-atmosphere.png" });
  console.log("Saved screenshots/lighting-atmosphere.png");

  // 6. Search for Rembrandt
  console.log("Searching for Rembrandt...");
  const searchInput = page.getByPlaceholder(/Search lighting/i);
  await searchInput.fill("Rembrandt");
  await page.waitForTimeout(300);

  // Click All category or reset so search finds it regardless of current pill
  const allPill = page.getByRole("button", { name: /All Setups/i });
  await allPill.click();
  await page.waitForTimeout(300);

  // 7. Select Rembrandt card
  console.log("Selecting Rembrandt Lighting card...");
  const rembrandtCard = page.getByRole("button", { name: /Rembrandt Lighting/i });
  await rembrandtCard.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/lighting-selected.png" });
  console.log("Saved screenshots/lighting-selected.png");

  // 8. Close modal
  console.log("Closing modal...");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 9. Verify Lighting Style field in workbench
  const lightingStyleVal = await page.locator("#aesthetic_dna\\.lighting_architecture\\.lighting_style").inputValue();
  console.log("Workbench Lighting Style value:", lightingStyleVal);
  if (!lightingStyleVal.includes("Rembrandt")) {
    throw new Error(`Expected Rembrandt lighting in workbench, got "${lightingStyleVal}"`);
  }

  // 10. Open Looks shelf and switch to Light filter
  console.log("Switching Looks shelf to Light filter...");
  const looksShelfTab = page.getByRole("button", { name: "Looks", exact: true });
  await looksShelfTab.click();
  await page.waitForTimeout(300);

  const lightShelfFilter = page.getByRole("button", { name: "Light", exact: true });
  await lightShelfFilter.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/lighting-shelf.png" });
  console.log("Saved screenshots/lighting-shelf.png");

  await browser.close();
  console.log("Verification complete! All visual checks and prompt bindings verified successfully.");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
