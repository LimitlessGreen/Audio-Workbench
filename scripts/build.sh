#!/usr/bin/env bash
set -euo pipefail

# Kopiert src/ und dist/ aus PARENT-PROJEKT in diese Library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PARENT_DIR="$(cd "${ROOT_DIR}/.." && pwd)"

mkdir -p "${ROOT_DIR}/src" "${ROOT_DIR}/dist"
rm -rf "${ROOT_DIR}/src"/* "${ROOT_DIR}/dist"/*
cp -a "${PARENT_DIR}/src/player/." "${ROOT_DIR}/src/"
cp -a "${PARENT_DIR}/dist/." "${ROOT_DIR}/dist/"

echo "✅ Library src/dist aktualisiert (Build: $(date '+%Y-%m-%d %H:%M:%S'))"
