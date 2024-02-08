#!/bin/bash -e
set -x

url="${1:-http\:\/\/localhost\:3000}"
length="${2:-5}"
inner_interval="${3:-2}"
outer_interval="${4:-2}"

while true; do
  echo "Starting load test..."
  echo "url:$url length:$length inner_interval:$inner_interval outer_interval:$outer_interval"
  echo ''
  for ((i=0; i<length; i++ )); do
    curl "$url"
    sleep "$inner_interval"
  done
  sleep "$outer_interval"
done
