#!/bin/bash
echo "Reset del database (solo development!)"
read -p "Sei sicuro? (y/N): " confirm
[[ $confirm != "y" ]] && echo "Annullato." && exit 0
docker-compose exec backend npx prisma migrate reset --force
echo "Database resettato e seed eseguito"
