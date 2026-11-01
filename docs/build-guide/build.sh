#!/bin/sh
# Rebuild the PDF from guide.html, then render each page to PNG for review.
set -eu
cd "$(dirname "$0")/../.."
rm -rf docs/build-guide/pages
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer \
  --allow-file-access-from-files --virtual-time-budget=15000 \
  --print-to-pdf="$PWD/docs/Prompt-Forge-Build-Guide.pdf" "file://$PWD/docs/build-guide/guide.html" 2>/dev/null
swift docs/build-guide/render.swift docs/Prompt-Forge-Build-Guide.pdf docs/build-guide/pages
