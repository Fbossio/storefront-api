#!/bin/bash
# check-postgres.sh

set -e

host="$1"
shift
cmd="$@"

until PGPASSWORD=$TEST_POSTGRES_PASSWORD psql -h "$host" -U "$TEST_POSTGRES_USER" -d "$TEST_POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
