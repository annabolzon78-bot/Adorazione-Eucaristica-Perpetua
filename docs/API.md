# Adorazione Viva — API Reference

Base URL: `https://api.adorazioneviva.com/api`

## Autenticazione

```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Cappelle
| Method | Path                   | Auth | Descrizione                    |
|--------|------------------------|------|--------------------------------|
| GET    | /chapels               | No   | Lista con filtri               |
| GET    | /chapels/:id           | No   | Dettaglio cappella             |
| GET    | /chapels/nearby        | No   | Cappelle vicino a lat/lng      |
| GET    | /chapels/open-now      | No   | Aperte in questo momento       |
| POST   | /chapels               | ADMIN | Crea nuova cappella           |
| PUT    | /chapels/:id           | PARISH_ADMIN | Aggiorna         |

### Intenzioni
| Method | Path                   | Auth | Descrizione                    |
|--------|------------------------|------|--------------------------------|
| GET    | /intentions            | No   | Lista paginata                 |
| POST   | /intentions            | No   | Crea intenzione                |
| POST   | /intentions/:id/pray   | No   | Incrementa contatore preghiere |

### Turni
| Method | Path                   | Auth | Descrizione                    |
|--------|------------------------|------|--------------------------------|
| GET    | /shifts                | No   | Turni disponibili              |
| GET    | /shifts/mine           | USER | I miei turni                   |
| POST   | /shifts/:id/book       | USER | Prenota turno                  |
| DELETE | /shifts/:id/book       | USER | Cancella prenotazione          |

### Statistiche
| Method | Path                   | Auth | Descrizione                    |
|--------|------------------------|------|--------------------------------|
| GET    | /stats                 | No   | Statistiche globali            |
| POST   | /stats/adoring         | USER | Segna "sono davanti a Gesù"    |

### Utenti
| Method | Path                   | Auth | Descrizione                    |
|--------|------------------------|------|--------------------------------|
| POST   | /users/register        | No   | Registrazione                  |
| POST   | /users/login           | No   | Login → JWT                    |
| GET    | /users/me              | USER | Profilo corrente               |
