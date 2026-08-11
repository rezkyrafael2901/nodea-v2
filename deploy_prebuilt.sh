#!/bin/bash
export VERCEL_TOKEN=$(cat /tmp/vercel_token.txt)
cd /home/ubuntu/nodea-v2
npx vercel deploy .vercel/output --prod --yes 2>&1