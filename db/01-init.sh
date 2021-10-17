#!/bin/bash
set -e
export PGPASSWORD=$POSTGRES_PASSWORD;
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  \connect $POSTGRES_DB $POSTGRES_USER
  BEGIN;
  CREATE TYPE URL_DATA AS (
    url JSONB,
    response JSONB, 
    request JSONB
  );
  CREATE TABLE speedtest_data (
    id SERIAL PRIMARY KEY,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    data URL_DATA NOT NULL
  );
  COMMIT;
EOSQL
