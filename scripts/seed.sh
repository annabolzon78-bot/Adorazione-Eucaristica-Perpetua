#!/bin/bash
echo "Esecuzione seed..."
docker-compose exec backend npm run db:seed
echo "Seed completato"
