#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .venv/bin/activate ]; then
  python3 -m venv .venv
fi
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements-predict.txt
uvicorn predict_service:app --reload --host 127.0.0.1 --port 5000
