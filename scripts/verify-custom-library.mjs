import { chromium } from "playwright";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";

// Create a small test image file
const TEST_IMAGE_PATH = "/tmp/test-reference-photo.png";
const TEST_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFFJREFUeJztwTEBAAAAwqD1T20MH6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4M9AC4AAAUpsC2QAAAAASUVORK5CYII=";

writeFileSync(TEST_IMAGE_PATH, Buffer.from(TEST_IMAGE_BASE64, "base64"));

async function main() {
  console.log("Launching browser for Custom Library Addition verification...");
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

  // 1. Click Wardrobe cluster in nav[aria-label="Clusters"]
  console.log("Clicking Wardrobe cluster...");
  const navClusters = page.locator('nav[aria-label="Clusters"]');
  const wardrobeClusterBtn = navClusters.getByRole("button", { name: "Wardrobe" });
  await wardrobeClusterBtn.click();
  await page.waitForTimeout(500);

  // 2. Open Wardrobe Studio modal
  console.log("Opening Wardrobe Studio modal...");
  const openStudioBtn = page.getByRole("button", { name: /Wardrobe Studio/i }).first();
  await openStudioBtn.click();
  await page.waitForTimeout(600);

  // 3. Click "+ Add to Library"
  console.log("Clicking '+ Add to Library' button...");
  const addToLibraryBtn = page.getByRole("button", { name: /Add to Library/i });
  await addToLibraryBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/custom-library-modal-open.png" });
  console.log("Saved screenshots/custom-library-modal-open.png");

  // 4. Upload test reference photo
  console.log("Uploading reference image...");
  const fileInput = page.locator('input[type="file"][accept="image/*"]');
  await fileInput.setInputFiles(TEST_IMAGE_PATH);
  await page.waitForTimeout(600);

  // 5. Fill out custom piece form
  console.log("Selecting Individual Piece tab...");
  const pieceTypeBtn = page.getByRole("button", { name: "Individual Piece", exact: true });
  await pieceTypeBtn.click();
  await page.waitForTimeout(400);

  console.log("Filling out piece details...");
  const nameInput = page.getByPlaceholder(/Distressed Leather Moto Jacket/i);
  await nameInput.fill("Cyberpunk Tactical Holster Vest");

  // Select slot
  const slotSelect = page.locator("select");
  await slotSelect.selectOption("outerwear");

  const subcategoryInput = page.getByPlaceholder(/jacket, boots, hoodie/i);
  await subcategoryInput.fill("holster vest");

  const colorsInput = page.getByPlaceholder(/black, distressed brown/i);
  await colorsInput.fill("matte black, neon cyan");

  const materialsInput = page.getByPlaceholder(/cowhide leather, heavy denim/i);
  await materialsInput.fill("ballistic nylon, tactical webbing");

  const promptInput = page.getByPlaceholder(/classic oversized black leather/i);
  await promptInput.fill(
    "futuristic matte black ballistic nylon chest rig tactical vest with modular pouches and neon cyan quick-release buckles",
  );

  // Add custom tag
  const tagInput = page.getByPlaceholder(/Type custom tag/i);
  await tagInput.fill("cyberpunk");
  await tagInput.press("Enter");
  await page.waitForTimeout(300);

  await page.screenshot({ path: "screenshots/custom-library-form-filled.png" });
  console.log("Saved screenshots/custom-library-form-filled.png");

  // 6. Test JSON Editor Mode Toggle
  console.log("Switching to JSON Editor mode...");
  const jsonModeBtn = page.getByRole("button", { name: /JSON Editor/i });
  await jsonModeBtn.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: "screenshots/custom-library-json-editor.png" });
  console.log("Saved screenshots/custom-library-json-editor.png");

  // 7. Save to Library
  console.log("Clicking 'Save to Library'...");
  const saveBtn = page.locator("button.bg-rose-500", { hasText: "Save to Library" });
  await saveBtn.click();
  await page.waitForTimeout(800);

  // 8. Switch to Individual Pieces tab
  console.log("Checking Individual Pieces tab for the new custom item...");
  const piecesTab = page.getByRole("button", { name: /Individual Pieces/i });
  await piecesTab.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "screenshots/custom-library-item-in-catalog.png" });
  console.log("Saved screenshots/custom-library-item-in-catalog.png");

  // 9. Click the custom piece
  console.log("Clicking custom piece 'Cyberpunk Tactical Holster Vest'...");
  const customPieceCard = page.getByRole("button", { name: /Cyberpunk Tactical Holster Vest/i });
  await customPieceCard.click();
  await page.waitForTimeout(600);

  // 10. Close Wardrobe Studio modal
  console.log("Closing modal to inspect workbench...");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);

  // 11. Verify workbench outerwear field
  const outerwearVal = await page
    .locator("#subjects\\.0\\.wardrobe_architecture\\.layering_system\\.outerwear")
    .inputValue();
  console.log("Outerwear field value:", outerwearVal);
  if (!outerwearVal.includes("ballistic nylon chest rig tactical vest")) {
    throw new Error(`Expected custom vest prompt in outerwear, got: "${outerwearVal}"`);
  }

  await page.screenshot({ path: "screenshots/custom-library-workbench-applied.png" });
  console.log("Saved screenshots/custom-library-workbench-applied.png");

  // 12. Reload the page to verify persistent storage across sessions
  console.log("Reloading page to test persistence...");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Re-open Wardrobe Studio modal
  const openStudioAgain = page.getByRole("button", { name: /Wardrobe Studio/i }).first();
  await openStudioAgain.click();
  await page.waitForTimeout(600);

  const piecesTabAgain = page.getByRole("button", { name: /Individual Pieces/i });
  await piecesTabAgain.click();
  await page.waitForTimeout(500);

  // Check custom piece is still there!
  const customCardPersisted = page.getByRole("button", { name: /Cyberpunk Tactical Holster Vest/i });
  const isVisible = await customCardPersisted.isVisible();
  console.log("Custom piece persisted after reload:", isVisible);
  if (!isVisible) {
    throw new Error("Custom piece did not persist across page reload!");
  }

  await page.screenshot({ path: "screenshots/custom-library-persisted.png" });
  console.log("Saved screenshots/custom-library-persisted.png");

  await browser.close();

  // Cleanup test image
  if (existsSync(TEST_IMAGE_PATH)) {
    unlinkSync(TEST_IMAGE_PATH);
  }

  console.log("All Custom Library verification checks PASSED successfully!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  if (existsSync(TEST_IMAGE_PATH)) {
    unlinkSync(TEST_IMAGE_PATH);
  }
  process.exit(1);
});
