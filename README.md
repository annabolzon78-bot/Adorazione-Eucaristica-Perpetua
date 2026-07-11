# ❤️‍🔥 Adorazione Viva

> **Gesù Eucaristia ti aspetta. Ovunque tu sia.**

Piattaforma mondiale per trovare, promuovere e vivere l'Adorazione Eucaristica.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Zustand + Leaflet
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Infrastructure**: Docker + Nginx + Let's Encrypt

## Quick Start

```bash
cp .env.example .env
./scripts/dev.sh
```

→ App: http://localhost:5173  
→ API: http://localhost:4000/api  
→ Health: http://localhost:4000/api/health

## Struttura

```
adorazione-viva/
├── frontend/          # React app
├── backend/           # Express API
├── database/          # Prisma schema + seeds
├── docs/              # Documentazione
└── scripts/           # dev, prod, db-reset, seed
```

## Documentazione

- [Architettura](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Setup & Deploy](docs/SETUP.md)

## Visione

Adorazione Viva nasce per diventare il riferimento mondiale per trovare un luogo di Adorazione Eucaristica, aiutando milioni di persone a parteciparvi anche quando sono in viaggio.
