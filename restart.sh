#!/usr/bin/env bash
# Restarts the backend and frontend dev servers.
# Kills anything already listening on their ports, then starts both fresh.
#
# Usage: ./restart.sh [--backend-port PORT] [--frontend-port PORT]
# Defaults: backend 3001, frontend 3000
#
# The frontend proxies /api/* via src/setupProxy.js, which reads BACKEND_PORT
# at frontend startup — this script passes --backend-port through as that env var.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PORT="${BACKEND_PORT:-3001}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

while [ $# -gt 0 ]; do
  case "$1" in
    --backend-port) BACKEND_PORT="$2"; shift 2 ;;
    --frontend-port) FRONTEND_PORT="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 [--backend-port PORT] [--frontend-port PORT]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

LOG_DIR="$ROOT_DIR/.logs"
mkdir -p "$LOG_DIR"

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti "tcp:${port}" || true)"
  if [ -n "$pids" ]; then
    echo "Killing process(es) on port ${port}: ${pids}"
    kill -9 $pids
  else
    echo "No process running on port ${port}"
  fi
}

echo "== Stopping existing servers =="
kill_port "$BACKEND_PORT"
kill_port "$FRONTEND_PORT"

echo "== Starting backend on port ${BACKEND_PORT} =="
(cd "$ROOT_DIR/backend" && PORT="$BACKEND_PORT" nohup npm start > "$LOG_DIR/backend.log" 2>&1 &)

echo "== Starting frontend on port ${FRONTEND_PORT} (proxying to backend port ${BACKEND_PORT}) =="
(cd "$ROOT_DIR/frontend" && PORT="$FRONTEND_PORT" BACKEND_PORT="$BACKEND_PORT" nohup npm start > "$LOG_DIR/frontend.log" 2>&1 &)

echo "== Done =="
echo "Backend log:  $LOG_DIR/backend.log"
echo "Frontend log: $LOG_DIR/frontend.log"
