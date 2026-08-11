#!/usr/bin/env bash
# Nodea-v2 Vercel deploy helper — reads token at runtime, never logs it.
set -euo pipefail
cd /home/ubuntu/nodea-v2

TOKEN_FILE=/home/ubuntu/nodea/.env.local
TOKEN=$(grep '^VERCEL_TOKEN=' "$TOKEN_FILE" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")
if [ -z "$TOKEN" ]; then
  echo "NO_TOKEN"
  exit 1
fi
export VERCEL_TOKEN="$TOKEN"

case "${1:-}" in
  pull)
    npx vercel pull --yes --environment=production 2>&1 | tail -2 ;;
  build)
    npx vercel build --prod 2>&1 | tail -20 ;;
  deploy)
    npx vercel deploy --prebuilt --prod --yes 2>&1 | tail -15 ;;
  whoami)
    npx vercel whoami 2>&1 | head -2 ;;
  *)
    echo "usage: $0 {pull|build|deploy|whoami}" ;;
esac