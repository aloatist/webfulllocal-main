#!/usr/bin/env bash
set -euo pipefail

# Ensure we always run from the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec n8n start --user-folder "$SCRIPT_DIR"
