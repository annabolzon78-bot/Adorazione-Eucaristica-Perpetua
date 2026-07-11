-- Adorazione Viva — PostgreSQL init
-- Prisma handles schema, this is for extensions only

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search
CREATE EXTENSION IF NOT EXISTS "postgis";  -- for geospatial queries (optional)
