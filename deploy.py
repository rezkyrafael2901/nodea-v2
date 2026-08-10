#!/usr/bin/env python3
import subprocess
import sys
import os

# Token provided by user - read from file
with open('/tmp/token.txt', 'r') as f:
    token = f.read().strip()

# Set env var
os.environ['VERCEL_TOKEN'] = token

# Deploy
result = subprocess.run(
    ['npx', 'vercel', 'deploy', '--prod', '--yes'],
    cwd='/home/ubuntu/nodea-v2',
    capture_output=True,
    text=True,
    timeout=300
)
print("STDOUT:", result.stdout[-3000:])
print("STDERR:", result.stderr[-500:])
print("Return:", result.returncode)
