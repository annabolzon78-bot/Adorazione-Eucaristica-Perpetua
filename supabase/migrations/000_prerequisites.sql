-- ============================================================
-- 000 — PREREQUISITES
-- DA ESEGUIRE PRIMA DI TUTTI GLI ALTRI FILE
-- ============================================================
-- Nota: su Supabase queste estensioni sono già abilitate di default.
--       Questo file serve come verifica esplicita.

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pgcrypto (per gen_random_uuid() usato nei DEFAULT)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Full-text search in italiano
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- pg_trgm: similarità testo per ricerca fuzzy
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
