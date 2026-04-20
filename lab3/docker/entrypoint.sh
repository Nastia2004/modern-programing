#!/bin/sh
set -eu

cat > /usr/share/nginx/html/config.js <<EOF_CONFIG
window.__APP_CONFIG__ = {
  API_URL: "${API_URL:-http://localhost:3000}"
};
EOF_CONFIG

cat > /etc/nginx/conf.d/default.conf <<EOF_NGINX
server {
  listen ${PORT:-8080};
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location = /health {
    access_log off;
    return 200 "ok\n";
    add_header Content-Type text/plain;
  }
}
EOF_NGINX

exec nginx -g "daemon off;"
