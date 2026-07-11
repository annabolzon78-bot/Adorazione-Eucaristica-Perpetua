# Setup — Adorazione Viva

## Prerequisiti

- Docker Desktop
- Node.js 20+
- Git

## Development

```bash
# 1. Clona il progetto
git clone <repo>
cd adorazione-viva

# 2. Copia le variabili d'ambiente
cp .env.example .env

# 3. Avvia tutto con Docker
./scripts/dev.sh

# oppure manualmente:
docker-compose up --build
```

Servizi disponibili:
- Frontend: http://localhost:5173
- Backend:  http://localhost:4000
- DB:       localhost:5432

```bash
# 4. Esegui seed dati iniziali (primo avvio)
./scripts/seed.sh
```

## Senza Docker

```bash
# Backend
cd backend && npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (altro terminale)
cd frontend && npm install
npm run dev
```

## Production

```bash
# Configura .env con valori reali
nano .env

# Deploy
./scripts/prod.sh
```
