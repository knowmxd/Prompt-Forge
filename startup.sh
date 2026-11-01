#!/bin/sh
set -eu
cd "$(dirname "$0")"
if [ -d "/Users/master/.nvm/versions/node/v24.11.1/bin" ]; then
  export PATH="/Users/master/.nvm/versions/node/v24.11.1/bin:$PATH"
fi
# :8081 is QA-only — a revive must never inherit a stale built-output preview.
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
