#!/usr/bin/env sh
cd "$(dirname "$0")"
python3 -c "import PIL" 2>/dev/null || python3 -m pip install -r requirements.txt
python3 backend/server.py
