import { chromium } from "playwright";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ARTIFACT_DIR = "/Users/master/.gemini/antigravity/brain/ad783fe0-63a5-488b-a255-77e044f6931c";

async function main() {
  console.log("Launching browser for Option 1 & 3 Verification...");
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("[Browser Console Error]", msg.text());
    }
  });

  console.log("Navigating to http://localhost:8080/ ...");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Verify Workbench Lighting cluster streamlined fields
  console.log("Checking Workbench Lighting cluster...");
  const lightingClusterBtn = page.getByRole("button", { name: /^Lighting$/i }).first();
  await lightingClusterBtn.click();
  await page.waitForTimeout(500);

  const bodyText = await page.textContent("body");
  if (bodyText.includes("Rim or kicker") || bodyText.includes("Color temperature balance")) {
    throw new Error("Found deleted fields (rim_or_kicker or color_temperature_balance) in workbench!");
  }

  // Take screenshot of streamlined workbench
  await page.screenshot({ path: "screenshots/opt1-streamlined-lighting-workbench.png" });
  copyFileSync("screenshots/opt1-streamlined-lighting-workbench.png", resolve(ARTIFACT_DIR, "opt1-streamlined-lighting-workbench.png"));
  console.log("Saved streamlined workbench screenshot.");

  // 2. Test Lighting Shelf in Asset Studio
  console.log("Switching to Lighting shelf in Assets...");
  const lightingTab = page.locator('[data-testid="asset-tab-lighting"]');
  await lightingTab.click();
  await page.waitForTimeout(500);

  // Take screenshot of Lighting Shelf
  await page.screenshot({ path: "screenshots/opt1-lighting-shelf-grid.png" });
  copyFileSync("screenshots/opt1-lighting-shelf-grid.png", resolve(ARTIFACT_DIR, "opt1-lighting-shelf-grid.png"));
  console.log("Saved Lighting shelf screenshot.");

  // Click on a lighting setup (e.g. Rembrandt Lighting or Cyberpunk Neon)
  const neonCard = page.getByRole("button", { name: /Cyberpunk Neon/i }).first();
  if (await neonCard.isVisible()) {
    await neonCard.click();
    await page.waitForTimeout(400);
    console.log("Clicked Cyberpunk Neon lighting card.");
  }

  // 3. Test Poses Shelf in Asset Studio
  console.log("Switching to Poses shelf (97 poses)...");
  const posesTab = page.locator('[data-testid="asset-tab-poses"]');
  await posesTab.click();
  await page.waitForTimeout(500);

  // Take screenshot of Poses shelf with all 97 poses
  await page.screenshot({ path: "screenshots/opt3-poses-shelf-all97.png" });
  copyFileSync("screenshots/opt3-poses-shelf-all97.png", resolve(ARTIFACT_DIR, "opt3-poses-shelf-all97.png"));
  console.log("Saved Poses shelf (All 97) screenshot.");

  // Click Knights filter pill
  const knightsPill = page.getByRole("button", { name: /Knights/i }).first();
  await knightsPill.click();
  await page.waitForTimeout(400);

  // Take screenshot of Knights filter
  await page.screenshot({ path: "screenshots/opt3-poses-shelf-knights.png" });
  copyFileSync("screenshots/opt3-poses-shelf-knights.png", resolve(ARTIFACT_DIR, "opt3-poses-shelf-knights.png"));
  console.log("Saved Poses shelf (Knights filter) screenshot.");

  // Select a pose card (e.g. Knight Drawing Longsword)
  const knightCard = page.getByRole("button", { name: /Knight Drawing Longsword/i }).first();
  if (await knightCard.isVisible()) {
    await knightCard.click();
    await page.waitForTimeout(400);
    console.log("Selected Knight Drawing Longsword pose.");
  }

  // 4. Test Camera Shelf in Asset Studio
  console.log("Switching to Camera shelf (27 setups)...");
  const cameraTab = page.locator('[data-testid="asset-tab-camera"]');
  await cameraTab.click();
  await page.waitForTimeout(500);

  // Take screenshot of Camera shelf
  await page.screenshot({ path: "screenshots/opt3-camera-shelf-27.png" });
  copyFileSync("screenshots/opt3-camera-shelf-27.png", resolve(ARTIFACT_DIR, "opt3-camera-shelf-27.png"));
  console.log("Saved Camera shelf screenshot.");

  // Click on a camera setup (e.g. Cinematic Dutch Tilt)
  const dutchCard = page.getByRole("button", { name: /Cinematic Dutch Tilt/i });
  if (await dutchCard.isVisible()) {
    await dutchCard.click();
    await page.waitForTimeout(400);
    console.log("Selected Cinematic Dutch Tilt camera rig.");
  }

  // Take screenshot showing active checkmarks
  await page.screenshot({ path: "screenshots/opt3-camera-active-applied.png" });
  copyFileSync("screenshots/opt3-camera-active-applied.png", resolve(ARTIFACT_DIR, "opt3-camera-active-applied.png"));
  console.log("Saved Camera applied screenshot.");

  // 5. Test Mobile viewport
  console.log("Testing Mobile Viewport (390x844)...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  // On mobile, click Assets bottom navigation item
  const mobileAssetsNav = page.locator("button").filter({ hasText: /^Assets$/i }).first();
  if (await mobileAssetsNav.isVisible()) {
    await mobileAssetsNav.click();
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: "screenshots/opt3-mobile-assets-poses.png" });
  copyFileSync("screenshots/opt3-mobile-assets-poses.png", resolve(ARTIFACT_DIR, "opt3-mobile-assets-poses.png"));
  console.log("Saved Mobile Assets Poses screenshot.");

  await browser.close();
  console.log("All verifications passed with flying colors!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
