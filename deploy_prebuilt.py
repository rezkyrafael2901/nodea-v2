#!/usr/bin/env python3
import os
import subprocess
from pathlib import Path

token = Path('/tmp/vercel_token.txt').read_text().strip()
env = os.environ.copy()
env['VERCEL_TOKEN'] = token
p = subprocess.run(
    ['npx', 'vercel', 'deploy', '--prebuilt', '--prod', '--yes'],
    cwd='/home/ubuntu/nodea-v2', env=env, text=True
)
raise SystemExit(p.returncode)
屈