#!/bin/bash
set -e
echo "Avvio Adorazione Viva in PRODUCTION..."
[ ! -f .env ] && echo ".env mancante" && exit 1
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml ps
