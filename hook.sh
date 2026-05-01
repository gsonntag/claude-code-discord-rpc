#!/bin/bash
PAYLOAD=$(cat)
PORT="${RPC_PORT:-7463}"
DIR="$(cd "$(dirname "$0")" && pwd)"

# Load .env so DISCORD_CLIENT_ID is available even if not in shell env
if [ -f "${DIR}/.env" ]; then
  set -a; source "${DIR}/.env"; set +a
fi

send() {
  curl -s -X POST "http://127.0.0.1:${PORT}/hook" \
    -H "Content-Type: application/json" \
    --data-binary "$PAYLOAD" \
    --max-time 1 \
    > /dev/null 2>&1
}

# Fast path: daemon already running
if send; then exit 0; fi

# Daemon not running — start it in the background
DISCORD_CLIENT_ID="$DISCORD_CLIENT_ID" \
RPC_PORT="$PORT" \
node "${DIR}/src/index.js" >> "${DIR}/daemon.log" 2>&1 &

# Wait up to 4 seconds for it to be ready
for _ in 1 2 3 4; do
  sleep 1
  if send; then exit 0; fi
done
