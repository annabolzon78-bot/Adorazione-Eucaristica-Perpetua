#!/bin/bash
set -e
echo "Avvio Adorazione Viva in DEVELOPMENT..."
cp -n .env.example .env 2>/dev/null || true
docker-compose up --build
