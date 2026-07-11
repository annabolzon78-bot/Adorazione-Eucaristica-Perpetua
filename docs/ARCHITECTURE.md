# Adorazione Viva — Architettura

## Stack

| Layer      | Tecnologia              |
|------------|-------------------------|
| Frontend   | React 18 + TypeScript + Vite |
| Backend    | Node.js + Express + TypeScript |
| Database   | PostgreSQL 16           |
| ORM        | Prisma                  |
| State      | Zustand                 |
| Routing    | React Router v6         |
| Map        | Leaflet + React-Leaflet |
| Container  | Docker + Docker Compose |
| Proxy      | Nginx                   |
| SSL        | Let's Encrypt + Certbot |

## Struttura

```
adorazione-viva/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Layout, UI, Map components
│   │   ├── pages/         # Home, Trova, Catena, Prega, Comunita
│   │   ├── hooks/         # useChapels, useStats, useGeolocation
│   │   ├── services/      # API layer (axios)
│   │   ├── store/         # Zustand global state
│   │   ├── types/         # TypeScript interfaces
│   │   └── styles/        # CSS variables dal prototipo
│   └── Dockerfile
│
├── backend/               # Node.js + Express + TypeScript
│   └── src/
│       ├── config/        # env.ts, database.ts (Prisma)
│       ├── routes/        # chapels, intentions, shifts, users, parishes, stats
│       ├── controllers/   # business logic per ogni resource
│       ├── middleware/     # auth JWT, errorHandler, validate
│       ├── services/      # logica di business complessa
│       └── utils/         # logger, response helpers
│
├── database/
│   └── prisma/
│       ├── schema.prisma  # modelli: User, Parish, Chapel, Schedule, Shift, Intention
│       └── seeds/         # dati iniziali
│
├── docs/                  # Documentazione
├── scripts/               # dev.sh, prod.sh, db-reset.sh, seed.sh
├── docker-compose.yml     # Development
└── docker-compose.prod.yml # Production
```

## Flusso dati

```
Browser → Vite Dev Server → [proxy /api] → Express → Prisma → PostgreSQL
                    (prod: Nginx → backend container)
```

## Modelli principali

- **User** — fedeli e admin parrocchiali
- **Parish** — parrocchie verificate
- **Chapel** — cappelle con coordinate, tipo adorazione, streaming
- **Schedule** — orari Messe, Adorazione, Confessioni
- **Shift** — turni di adorazione prenotabili
- **Intention** — intenzioni di preghiera con contatore
- **GlobalStat** — singleton per contatore mondiale adoratori
