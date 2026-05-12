#!/bin/sh
set -e

normalize_postgres_url() {
  raw_url="$1"
  cleaned_url="${raw_url#postgresql://}"
  cleaned_url="${cleaned_url#postgres://}"

  userinfo="${cleaned_url%@*}"
  host_and_path="${cleaned_url#*@}"

  username="${userinfo%%:*}"
  password="${userinfo#*:}"
  hostport="${host_and_path%%/*}"
  database="${host_and_path#*/}"
  database="${database%%\?*}"

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${hostport}/${database}"
  export SPRING_DATASOURCE_USERNAME="$username"
  export SPRING_DATASOURCE_PASSWORD="$password"
}

if [ -n "$SPRING_DATASOURCE_URL" ]; then
  case "$SPRING_DATASOURCE_URL" in
    jdbc:*) echo "Using provided JDBC datasource URL" ;;
    postgresql://*|postgres://*) echo "Converting provided datasource URL to JDBC"; normalize_postgres_url "$SPRING_DATASOURCE_URL" ;;
  esac
elif [ -n "$DATABASE_URL" ]; then
  echo "Converting Render DATABASE_URL to JDBC"
  normalize_postgres_url "$DATABASE_URL"
fi

exec java -jar /app/app.jar