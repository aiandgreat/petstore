#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ -z "$SPRING_DATASOURCE_URL" ]; then
  cleaned_url="$DATABASE_URL"
  cleaned_url="${cleaned_url#postgresql://}"
  cleaned_url="${cleaned_url#postgres://}"

  userinfo="${cleaned_url%@*}"
  host_and_path="${cleaned_url#*@}"

  username="${userinfo%%:*}"
  password="${userinfo#*:}"
  hostport="${host_and_path%%/*}"
  database="${host_and_path#*/}"

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${hostport}/${database}"
  export SPRING_DATASOURCE_USERNAME="$username"
  export SPRING_DATASOURCE_PASSWORD="$password"
fi

exec java -jar /app/app.jar