#!/usr/bin/sh

docker run --rm -p 80:80 -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro nginx