#!/bin/bash
export VERCEL_TOKEN=$(cat /tmp/vercel_token.txt)
"$@"