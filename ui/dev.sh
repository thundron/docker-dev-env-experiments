#!/bin/bash
docker compose -f ../docker-compose.development.yml up --no-deps ui --build
