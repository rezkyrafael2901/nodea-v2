#!/bin/bash
# Helper: export VERCEL_TOKEN from deploy.sh
TOKEN=$(grep '^export VERCEL_TOKEN' /home/ubuntu/nodea-v2/deploy.sh | head -1 | sed 's/^export VERCEL_TOKEN="//' | sed 's/"$//')
export VERCEL_TOKEN="$TOKEN"
"$@"