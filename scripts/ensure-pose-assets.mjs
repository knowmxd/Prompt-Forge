import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const ROOT = process.cwd();
const RELEASE_BASE =
  "https://github.com/knowmxd/Prompt-Forge/releases/download/v2.0-poses-5k";

const BUNDLES = [
  {
    name: "poses-5k",
    archive: "poses-5k.tar.gz",
    sentinel: resolve(ROOT, "public/poses/pose_5000.webp"),
  },
];

async function downloadAndExtract(archiveName) {
  const url = `${RELEASE_BASE}/${archiveName}`;
  const tmpTar = resolve("/tmp", archiveName);
  console.log(`[poses] Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tmpTar));
  mkdirSync(resolve(ROOT, "public/poses"), { recursive: true });
  execFileSync("tar", ["-xzf", tmpTar, "-C", resolve(ROOT, "public/poses")], {
    stdio: "inherit",
  });
  console.log(`[poses] Extracted ${archiveName} into public/poses/`);
}

async function main() {
  for (const bundle of BUNDLES) {
    if (existsSync(bundle.sentinel)) {
      continue;
    }
    await downloadAndExtract(bundle.archive);
  }
}

main().catch((err) => {
  console.error("[poses] Failed to ensure pose assets:", err);
  process.exit(1);
});
