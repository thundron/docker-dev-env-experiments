#!/bin/bash
set -e
export PGPASSWORD=$POSTGRES_PASSWORD;
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  \connect $POSTGRES_DB $POSTGRES_USER
  BEGIN;
  CREATE TABLE speedtest_data (
    id SERIAL PRIMARY KEY,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    data JSONB NOT NULL
  );
  COMMIT;
EOSQL
